import crypto from 'node:crypto'

export const config = { api: { bodyParser: false } }

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body))
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left || '')
  const rightBuffer = Buffer.from(right || '')
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

async function rawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  const secret = process.env.PAYMENT_WEBHOOK_SECRET
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret || !url || !serviceKey) return json(res, 503, { error: 'Webhook not configured' })

  const raw = await rawBody(req)
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  if (!safeEqual(req.headers['x-zappage-signature'], expected)) return json(res, 401, { error: 'Invalid signature' })

  let event
  try {
    event = JSON.parse(raw)
  } catch {
    return json(res, 400, { error: 'Invalid JSON' })
  }
  const provider = String(event.provider || 'generic').slice(0, 80)
  const externalId = String(event.external_id || event.payment_id || '').slice(0, 180)
  const status = String(event.status || '').toLowerCase()
  const accepted = new Set(['pending', 'paid', 'overdue', 'cancelled', 'refunded', 'failed'])
  if (!externalId || !accepted.has(status)) return json(res, 400, { error: 'Invalid payment payload' })

  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }
  const orderResponse = await fetch(`${url}/rest/v1/orders?provider=eq.${encodeURIComponent(provider)}&external_id=eq.${encodeURIComponent(externalId)}`, {
    method: 'PATCH', headers, body: JSON.stringify({ status, paid_at: status === 'paid' ? new Date().toISOString() : null }),
  })
  if (!orderResponse.ok) return json(res, 502, { error: 'Could not update order' })
  const [order] = await orderResponse.json()
  if (!order) return json(res, 404, { error: 'Order not found' })

  const eventId = String(event.event_id || `${provider}:${externalId}:${status}`).slice(0, 200)
  await fetch(`${url}/rest/v1/payment_events?on_conflict=provider,external_event_id`, {
    method: 'POST', headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ order_id: order.id, provider, external_event_id: eventId, event_type: status, payload: event }),
  })
  return json(res, 200, { received: true })
}
