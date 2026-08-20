const buckets = new Map()
const ALLOWED_EVENTS = new Set(['page_view', 'cta_click', 'plan_click', 'whatsapp_click', 'outbound_click'])

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body))
}

function isRateLimited(key) {
  const now = Date.now()
  const current = (buckets.get(key) || []).filter(timestamp => now - timestamp < 60_000)
  if (current.length >= 30) return true
  current.push(now)
  buckets.set(key, current)
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  const origin = req.headers.origin || ''
  const allowedOrigin = process.env.SITE_URL || ''
  if (allowedOrigin && origin && origin !== allowedOrigin) return json(res, 403, { error: 'Invalid origin' })
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (isRateLimited(ip)) return json(res, 429, { error: 'Too many events' })

  const event = req.body || {}
  if (!ALLOWED_EVENTS.has(event.event_name) || typeof event.session_id !== 'string' || event.session_id.length > 120) {
    return json(res, 400, { error: 'Invalid event' })
  }
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return json(res, 202, { accepted: false })

  const payload = {
    event_name: event.event_name,
    source: String(event.source || 'landing').slice(0, 80),
    path: String(event.path || '/').slice(0, 500),
    label: String(event.label || '').slice(0, 180),
    plan_name: String(event.plan_name || '').slice(0, 100),
    session_id: event.session_id,
    metadata: event.metadata && typeof event.metadata === 'object' ? event.metadata : {},
  }
  const response = await fetch(`${url}/rest/v1/analytics_events`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) return json(res, 502, { error: 'Analytics unavailable' })
  return res.status(204).end()
}
