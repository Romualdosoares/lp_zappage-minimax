import { portfolioImageFields, validatePortfolioImage } from './portfolioImages'
import { createSessionManager, withSessionRetry } from './authSession'

const SUPABASE_BASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://yeqcojnwxxpffvfxoiwc.supabase.co'
const SUPABASE_REST_URL = `${SUPABASE_BASE_URL}/rest/v1`
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcWNvam53eHhwZmZ2ZnhvaXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDQ2MzEsImV4cCI6MjA5OTA4MDYzMX0.m0u1v3TSRBpmxoJm5CJj71o6i7bW1_CVzvCDy4vZVmQ'

const SESSION_KEY = 'zapPage.supabaseSession.v1'
const ANALYTICS_SESSION_KEY = 'zapPage.analyticsSession.v1'
const BRIEFING_ASSETS_BUCKET = 'briefing-assets'
const TESTIMONIAL_ASSETS_BUCKET = 'testimonial-assets'
const PLAN_BENEFITS_EVENT = 'zap-page:plan-benefits-changed'
const PLAN_BENEFITS_CHANNEL = 'zap-page-plan-benefits'
const VALID_PLAN_KEYS = new Set(['express', 'professional', 'turbo'])
const CLIENT_BRIEFING_COLUMNS = [
  'id',
  'order_number',
  'user_id',
  'business_name',
  'owner_name',
  'email',
  'whatsapp',
  'city',
  'niche',
  'instagram',
  'current_website',
  'plan_interest',
  'main_goal',
  'audience',
  'services',
  'differentials',
  'prices',
  'service_area',
  'tone',
  'brand_colors',
  'logo_status',
  'photos_status',
  'logo_file',
  'page_images',
  'required_sections',
  'reference_links',
  'objections',
  'notes',
  'status',
  'created_at',
  'updated_at',
].join(',')

export const portfolioSeed = [
  {
    id: 'portfolio-landing-whatsapp',
    title: 'Página profissional com WhatsApp',
    niche: 'Negócios locais',
    price: 'A partir de R$197',
    status: 'Ativo',
    featured: true,
    description:
      'Estrutura simples, rápida e otimizada para transformar visitas em conversas pelo WhatsApp.',
    deliverables: 'Hero, serviços, diferenciais, planos, FAQ e botões de WhatsApp.',
  },
  {
    id: 'portfolio-premium-local',
    title: 'Landing premium para atendimento local',
    niche: 'Clínicas, salões, assistências e prestadores',
    price: 'A partir de R$297',
    status: 'Ativo',
    featured: true,
    description:
      'Página com visual premium, copy direta e organização clara para passar mais confiança.',
    deliverables: 'Copy completa, seções comerciais, CTA mobile e suporte guiado.',
  },
  {
    id: 'portfolio-ads-ready',
    title: 'Página pronta para anúncios',
    niche: 'Tráfego pago',
    price: 'A partir de R$497',
    status: 'Ativo',
    featured: false,
    description:
      'Estrutura mais persuasiva para receber campanhas e direcionar o cliente ao WhatsApp.',
    deliverables: 'Página, copy aprimorada, criativos e direcionamento inicial.',
  },
]

function saveSession(session) {
  if (!session?.access_token) return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

const sessionManager = createSessionManager({
  load: getSession,
  save: saveSession,
  clear: clearSession,
  refresh: refreshToken => authRequest('/token?grant_type=refresh_token', { refresh_token: refreshToken }),
})

export function getAuthenticatedSession(options) {
  return sessionManager.getValidSession(options)
}

function getAnalyticsSessionId() {
  try {
    let sessionId = window.localStorage.getItem(ANALYTICS_SESSION_KEY)
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      window.localStorage.setItem(ANALYTICS_SESSION_KEY, sessionId)
    }
    return sessionId
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

async function parseResponse(response) {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.msg || data?.message || data?.error_description || data?.hint || 'Erro no Supabase.'
    const error = new Error(message)
    error.status = response.status
    error.code = data?.code
    throw error
  }

  return data
}

async function authRequest(path, body) {
  const response = await fetch(`${SUPABASE_BASE_URL}/auth/v1${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return parseResponse(response)
}

async function sendRestRequest(path, { method = 'GET', body, token, prefer } = {}) {
  if (!token) throw new Error('Token de autenticaÃ§Ã£o obrigatÃ³rio.')

  const response = await fetch(`${SUPABASE_REST_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  return parseResponse(response)
}

async function restRequest(path, { method = 'GET', body, token, prefer } = {}) {
  if (token) return sendRestRequest(path, { method, body, token, prefer })

  return withSessionRetry({
    getValidSession: getAuthenticatedSession,
    request: session => sendRestRequest(path, {
      method,
      body,
      token: session.access_token,
      prefer,
    }),
  })
}

function sanitizeFileName(name) {
  return String(name || 'arquivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export async function signUpClient({ name, email, password, whatsapp }) {
  const data = await authRequest('/signup', {
    email,
    password,
    data: {
      full_name: name,
      ...(whatsapp ? { whatsapp } : {}),
    },
  })
  if (data.access_token) saveSession(data)
  return data
}

export async function signIn(email, password) {
  const data = await authRequest('/token?grant_type=password', {
    email,
    password,
  })
  saveSession(data)
  return data
}

export async function uploadBriefingAsset(file, folder = 'imagens') {
  const session = await getAuthenticatedSession()
  if (!session?.access_token || !session?.user?.id) throw new Error('Sessão inválida.')
  if (!file) throw new Error('Selecione uma imagem.')

  const safeFolder = sanitizeFileName(folder)
  const safeName = sanitizeFileName(file.name) || 'imagem'
  const path = `${session.user.id}/${safeFolder}/${Date.now()}-${safeName}`
  const response = await fetch(
    `${SUPABASE_BASE_URL}/storage/v1/object/${BRIEFING_ASSETS_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: file,
    },
  )

  await parseResponse(response)

  const asset = {
    name: file.name,
    size: file.size,
    type: file.type,
    path,
    uploaded_at: new Date().toISOString(),
  }
  // Conveniência para a sessão atual. O caminho é a referência permanente; a URL expira.
  asset.url = await getBriefingAssetUrl(asset)
  return asset
}

export async function getBriefingAssetUrl(asset, expiresIn = 3600) {
  if (!asset?.path) return asset?.url || ''
  const session = await getAuthenticatedSession()
  if (!session?.access_token) throw new Error('Entre novamente para acessar este arquivo.')
  const response = await fetch(
    `${SUPABASE_BASE_URL}/storage/v1/object/sign/${BRIEFING_ASSETS_BUCKET}/${asset.path}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn }),
    },
  )
  const data = await parseResponse(response)
  return data?.signedURL ? `${SUPABASE_BASE_URL}/storage/v1${data.signedURL}` : ''
}

async function optimizeTestimonialPhoto(file) {
  if (typeof document === 'undefined' || !('createImageBitmap' in window)) return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const maxSide = 320
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return file
    context.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8))
    return blob?.size && blob.size < file.size ? blob : file
  } catch {
    return file
  } finally {
    bitmap?.close?.()
  }
}

export async function uploadTestimonialPhoto(file) {
  const session = await getAuthenticatedSession()
  if (!session?.access_token || !session?.user?.id) throw new Error('Sessão inválida.')
  if (!file?.type?.startsWith('image/')) throw new Error('Selecione uma imagem válida.')
  if (file.size > 5 * 1024 * 1024) throw new Error('A foto deve ter no máximo 5 MB.')

  const uploadFile = await optimizeTestimonialPhoto(file)
  const originalBaseName = String(file.name || 'depoimento').replace(/\.[^.]+$/, '')
  const extension = uploadFile.type === 'image/webp'
    ? 'webp'
    : sanitizeFileName(file.name).split('.').pop() || 'jpg'
  const safeName = `${sanitizeFileName(originalBaseName) || 'depoimento'}.${extension}`
  const path = `autorizados/${session.user.id}/${Date.now()}-${safeName}`
  const response = await fetch(
    `${SUPABASE_BASE_URL}/storage/v1/object/${TESTIMONIAL_ASSETS_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': uploadFile.type || file.type,
        'x-upsert': 'true',
      },
      body: uploadFile,
    },
  )

  await parseResponse(response)
  return {
    name: file.name,
    path,
    url: `${SUPABASE_BASE_URL}/storage/v1/object/public/${TESTIMONIAL_ASSETS_BUCKET}/${path}`,
  }
}

export async function signOut() {
  const session = getSession()
  if (session?.access_token) {
    try {
      await fetch(`${SUPABASE_BASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
      })
    } catch {
      // O logout local ainda deve acontecer mesmo se a chamada remota falhar.
    }
  }
  clearSession()
}

export async function getMyProfile() {
  const session = await getAuthenticatedSession()
  if (!session?.user?.id) return null
  const rows = await restRequest(
    `/profiles?select=*&id=eq.${session.user.id}&limit=1`,
  )
  return rows?.[0] || null
}

export async function getPortfolioServices({ admin = false } = {}) {
  const filter = admin ? '' : '&status=eq.Ativo'
  const rows = await restRequest(
    `/portfolio_services?select=*&order=featured.desc,created_at.desc${filter}`,
    admin ? undefined : { token: SUPABASE_ANON_KEY },
  )
  return rows.length ? rows : admin ? portfolioSeed : []
}

export async function savePortfolioService(item) {
  const payload = {
    id: item.id,
    title: item.title,
    niche: item.niche,
    price: item.price,
    status: item.status,
    featured: item.featured,
    description: item.description,
    deliverables: item.deliverables,
  }

  const rows = await restRequest('/portfolio_services?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  })
  return rows?.[0]
}

export async function deletePortfolioService(id) {
  await restRequest(`/portfolio_services?id=eq.${id}`, { method: 'DELETE' })
}

export async function getPlanBenefits({ admin = false } = {}) {
  const activeFilter = admin ? '' : '&is_active=eq.true'
  return restRequest(
    `/plan_benefits?select=id,plan_key,benefit_text,is_active,sort_order,created_at,updated_at&order=plan_key.asc,sort_order.asc,created_at.asc${activeFilter}`,
    admin ? undefined : { token: SUPABASE_ANON_KEY },
  )
}

function planBenefitPayload(item) {
  const planKey = String(item?.plan_key || '').trim()
  const benefitText = String(item?.benefit_text || '').trim()
  const sortOrder = Math.max(0, Math.round(Number(item?.sort_order) || 0))

  if (!VALID_PLAN_KEYS.has(planKey)) throw new Error('Selecione um plano válido.')
  if (benefitText.length < 2) throw new Error('Escreva o benefício com pelo menos 2 caracteres.')
  if (benefitText.length > 240) throw new Error('O benefício deve ter no máximo 240 caracteres.')

  return {
    plan_key: planKey,
    benefit_text: benefitText,
    is_active: item?.is_active !== false,
    sort_order: sortOrder,
  }
}

function notifyPlanBenefitsChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PLAN_BENEFITS_EVENT))

  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(PLAN_BENEFITS_CHANNEL)
      channel.postMessage({ type: 'changed', at: Date.now() })
      channel.close()
    } catch {
      // O evento local e o Realtime continuam cobrindo a atualização.
    }
  }
}

export async function savePlanBenefit(item) {
  const payload = planBenefitPayload(item)
  const isUpdate = Boolean(item?.id)
  const path = isUpdate
    ? `/plan_benefits?id=eq.${encodeURIComponent(item.id)}&select=*`
    : '/plan_benefits?select=*'
  const rows = await restRequest(path, {
    method: isUpdate ? 'PATCH' : 'POST',
    body: payload,
    prefer: 'return=representation',
  })
  const saved = rows?.[0]
  if (!saved) throw new Error('O Supabase não retornou o benefício salvo.')
  notifyPlanBenefitsChanged()
  return saved
}

export async function deletePlanBenefit(id) {
  if (!id) throw new Error('Benefício inválido.')
  await restRequest(`/plan_benefits?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
  notifyPlanBenefitsChanged()
}

let publicRealtimeClientPromise

function getPublicRealtimeClient() {
  if (!publicRealtimeClientPromise) {
    publicRealtimeClientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_BASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }),
    )
  }
  return publicRealtimeClientPromise
}

export function subscribeToPlanBenefits(onChange) {
  if (typeof window === 'undefined' || typeof onChange !== 'function') return () => {}

  let disposed = false
  let realtimeChannel = null
  let broadcastChannel = null
  const handleChange = () => {
    if (!disposed) onChange()
  }

  window.addEventListener(PLAN_BENEFITS_EVENT, handleChange)
  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(PLAN_BENEFITS_CHANNEL)
      broadcastChannel.addEventListener('message', handleChange)
    } catch {
      broadcastChannel = null
    }
  }

  getPublicRealtimeClient()
    .then(client => {
      if (disposed) return
      realtimeChannel = client
        .channel(`plan-benefits-${Math.random().toString(16).slice(2)}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'plan_benefits' },
          handleChange,
        )
        .subscribe()
    })
    .catch(() => {
      // Foco, reconexão e polling na seção pública continuam como fallback.
    })

  return () => {
    disposed = true
    window.removeEventListener(PLAN_BENEFITS_EVENT, handleChange)
    if (broadcastChannel) broadcastChannel.close()
    if (realtimeChannel) {
      getPublicRealtimeClient()
        .then(client => client.removeChannel(realtimeChannel))
        .catch(() => {})
    }
  }
}

function normalizeSiteUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) throw new Error('Informe o link do site.')

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  let url
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error('Informe um link válido, como https://empresa.com.br.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('O link precisa começar com http:// ou https://.')
  }
  return url.toString()
}

const PORTFOLIO_EVENT = 'zap-page:portfolio-changed'
const PORTFOLIO_CHANNEL = 'zap-page-portfolio'

function notifyClientSitesChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PORTFOLIO_EVENT))
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(PORTFOLIO_CHANNEL)
      channel.postMessage({ type: 'changed' })
      channel.close()
    } catch { /* Realtime and polling also synchronize open pages. */ }
  }
}

export function subscribeToClientSites(onChange) {
  if (typeof window === 'undefined') return () => {}
  let disposed = false
  let realtimeChannel
  let broadcastChannel
  const handleChange = () => { if (!disposed) onChange() }
  window.addEventListener(PORTFOLIO_EVENT, handleChange)
  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(PORTFOLIO_CHANNEL)
      broadcastChannel.addEventListener('message', handleChange)
    } catch { /* Polling remains available. */ }
  }
  getPublicRealtimeClient().then(client => {
    if (disposed) return
    realtimeChannel = client.channel(`portfolio-${Math.random().toString(16).slice(2)}`)
      // A public revision exposes no project data and also signals hidden/deleted rows.
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'portfolio_revision' }, handleChange)
      .subscribe(status => { if (status === 'SUBSCRIBED') handleChange() })
  }).catch(() => { /* Focus, reconnect and polling are fallback paths. */ })
  return () => {
    disposed = true
    window.removeEventListener(PORTFOLIO_EVENT, handleChange)
    broadcastChannel?.close()
    if (realtimeChannel) {
      getPublicRealtimeClient().then(client => client.removeChannel(realtimeChannel)).catch(() => {})
    }
  }
}

export async function getClientSites({ admin = false, landing = false, limit } = {}) {
  const publishedFilter = admin ? '' : '&is_published=eq.true'
  const landingFilter = landing && !admin ? '&show_on_landing=eq.true' : ''
  const rowLimit = Number(limit || (landing ? 6 : 0))
  const limitFilter = rowLimit > 0 ? `&limit=${rowLimit}` : ''
  return restRequest(
    `/client_sites?select=*&order=featured.desc,created_at.desc,id.asc${publishedFilter}${landingFilter}${limitFilter}`,
    admin ? undefined : { token: SUPABASE_ANON_KEY },
  )
}

export async function saveClientSite(item) {
  const companyName = String(item.company_name || '').trim()
  if (companyName.length < 2) throw new Error('Informe o nome da empresa.')

  const payload = {
    id: item.id,
    company_name: companyName,
    site_url: normalizeSiteUrl(item.site_url),
    is_published: Boolean(item.is_published),
    featured: Boolean(item.featured),
    show_on_landing: Boolean(item.is_published && item.show_on_landing),
    ...portfolioImageFields(item),
  }

  const rows = await restRequest('/client_sites?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  })
  const saved = rows?.[0]
  if (!saved) throw new Error('Não foi possível confirmar o trabalho salvo.')
  notifyClientSitesChanged()
  return saved
}

export async function deleteClientSite(id) {
  await restRequest(`/client_sites?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
  notifyClientSitesChanged()
}

export async function uploadPortfolioImage(file) {
  const session = await getAuthenticatedSession()
  if (!session?.access_token || !session?.user?.id) throw new Error('Sessão inválida.')
  validatePortfolioImage(file)
  const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type]
  const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`
  const response = await fetch(`${SUPABASE_BASE_URL}/storage/v1/object/portfolio-images/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}`, 'Content-Type': file.type },
    body: file,
  })
  await parseResponse(response)
  return `${SUPABASE_BASE_URL}/storage/v1/object/public/portfolio-images/${path}`
}

export async function getTestimonials({ admin = false } = {}) {
  try {
    const filter = admin ? '' : '&is_published=eq.true'
    return await restRequest(
      `/testimonials?select=*&order=featured.desc,created_at.desc${filter}`,
      admin ? undefined : { token: SUPABASE_ANON_KEY },
    )
  } catch {
    return []
  }
}

export async function saveTestimonial(item) {
  const payload = {
    id: item.id,
    client_name: String(item.client_name || '').trim(),
    business_type: String(item.business_type || '').trim(),
    location: String(item.location || '').trim(),
    quote: String(item.quote || '').trim(),
    rating: Number(item.rating || 5),
    photo_url: String(item.photo_url || '').trim(),
    photo_path: String(item.photo_path || '').trim(),
    is_published: Boolean(item.is_published),
    featured: Boolean(item.featured),
    consented_at: item.consented_at || new Date().toISOString(),
  }

  if (!payload.client_name || !payload.business_type || !payload.quote || !payload.photo_url) {
    throw new Error('Preencha nome, segmento, depoimento e foto autorizada.')
  }
  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    throw new Error('A nota deve estar entre 1 e 5.')
  }

  const rows = await restRequest('/testimonials?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  })
  return rows?.[0]
}

export async function deleteTestimonial(id) {
  await restRequest(`/testimonials?id=eq.${id}`, { method: 'DELETE' })
}

export async function getBriefingsForAdmin() {
  return restRequest('/briefings?select=*&order=updated_at.desc')
}

export async function getAnalyticsEventsForAdmin() {
  try {
    return await restRequest('/analytics_events?select=*&order=created_at.desc&limit=1000')
  } catch {
    return []
  }
}

export async function getAnalyticsSummaryForAdmin({ startAt, endAt } = {}) {
  try {
    return await restRequest('/rpc/admin_dashboard_metrics', {
      method: 'POST',
      body: {
        p_start: startAt || null,
        p_end: endAt || null,
      },
    })
  } catch {
    return null
  }
}

export async function getCrmTasksForAdmin() {
  try {
    return await restRequest('/crm_tasks?select=*&order=due_at.asc.nullslast,created_at.desc&limit=200')
  } catch {
    return []
  }
}

export async function saveCrmTask(task) {
  const payload = {
    id: task.id,
    briefing_id: task.briefing_id || null,
    title: String(task.title || '').trim(),
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'normal',
    assignee: task.assignee || '',
    due_at: task.due_at || null,
  }
  if (!payload.title) throw new Error('Informe o título da tarefa.')

  const rows = await restRequest('/crm_tasks?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  })
  return rows?.[0]
}

export async function updateCrmTask(id, fields) {
  const rows = await restRequest(`/crm_tasks?id=eq.${id}&select=*`, {
    method: 'PATCH',
    body: fields,
    prefer: 'return=representation',
  })
  return rows?.[0]
}

export async function getOrdersForAdmin() {
  try {
    return await restRequest('/orders?select=*&order=created_at.desc&limit=200')
  } catch {
    return []
  }
}

export async function saveOrder(order) {
  const amountCents = Number(order.amount_cents)
  if (!Number.isInteger(amountCents) || amountCents < 0) {
    throw new Error('Informe um valor válido em centavos.')
  }

  const payload = {
    id: order.id,
    briefing_id: order.briefing_id || null,
    customer_name: String(order.customer_name || '').trim(),
    customer_email: String(order.customer_email || '').trim().toLowerCase(),
    plan_name: order.plan_name || '',
    amount_cents: amountCents,
    currency: order.currency || 'BRL',
    status: order.status || 'pending',
    due_at: order.due_at || null,
    paid_at: order.paid_at || null,
    notes: order.notes || '',
  }
  if (!payload.customer_name || !payload.customer_email) {
    throw new Error('Informe nome e email do cliente.')
  }

  const rows = await restRequest('/orders?on_conflict=id&select=*', {
    method: 'POST',
    body: payload,
    prefer: 'resolution=merge-duplicates,return=representation',
  })
  return rows?.[0]
}

export async function trackAnalyticsEvent(eventName, payload = {}) {
  try {
    const search = new URLSearchParams(window.location.search)
    const metadata = {
      ...(payload.metadata || {}),
      referrer: document.referrer || '',
      utm_source: search.get('utm_source') || '',
      utm_medium: search.get('utm_medium') || '',
      utm_campaign: search.get('utm_campaign') || '',
      utm_content: search.get('utm_content') || '',
      utm_term: search.get('utm_term') || '',
      viewport:
        window.innerWidth < 768
          ? 'mobile'
          : window.innerWidth < 1024
            ? 'tablet'
            : 'desktop',
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        source: payload.source || 'landing',
        path: payload.path || window.location.pathname,
        label: payload.label || '',
        plan_name: payload.plan_name || '',
        session_id: getAnalyticsSessionId(),
        metadata,
      }),
    })
  } catch {
    // A página não deve falhar se o analytics ainda não estiver configurado no Supabase.
  }
}

export async function getBriefingByOrder(orderNumber) {
  const safeOrder = String(orderNumber || '').replace(/\D/g, '')
  if (!safeOrder) throw new Error('Numero da ordem invalido.')

  const rows = await restRequest(`/briefings?select=*&order_number=eq.${safeOrder}&limit=1`)
  return rows?.[0] || null
}

export async function getMyBriefing() {
  const session = await getAuthenticatedSession()
  if (!session?.user?.id) return null
  const rows = await restRequest(
    `/briefings?select=${CLIENT_BRIEFING_COLUMNS}&user_id=eq.${session.user.id}&limit=1`,
  )
  return rows?.[0] || null
}

export async function saveMyBriefing(form, status) {
  const session = await getAuthenticatedSession()
  if (!session?.user?.id) throw new Error('Sessão inválida.')

  const { id, created_at, order_number, admin_prompt, ...clientFields } = form
  const payload = {
    ...clientFields,
    user_id: session.user.id,
    email: session.user.email,
    status,
    updated_at: new Date().toISOString(),
  }

  if (!payload.logo_file) delete payload.logo_file
  if (!Array.isArray(payload.page_images) || payload.page_images.length === 0) {
    delete payload.page_images
  }

  if (id) {
    const rows = await restRequest(`/briefings?id=eq.${id}&select=*`, {
      method: 'PATCH',
      body: payload,
      prefer: 'return=representation',
    })
    return rows?.[0]
  }

  const rows = await restRequest('/briefings?select=*', {
    method: 'POST',
    body: payload,
    prefer: 'return=representation',
  })
  return rows?.[0]
}

export async function createAdminBriefing(form) {
  const { id, created_at, updated_at, order_number, user_id, ...fields } = form
  const payload = {
    ...fields,
    user_id: null,
    status: form.status || 'Manual',
    updated_at: new Date().toISOString(),
  }

  if (!payload.email) throw new Error('Informe o email do cliente.')
  if (!payload.logo_file) delete payload.logo_file
  if (!Array.isArray(payload.page_images) || payload.page_images.length === 0) {
    delete payload.page_images
  }

  const rows = await restRequest('/briefings?select=*', {
    method: 'POST',
    body: payload,
    prefer: 'return=representation',
  })
  return rows?.[0]
}

export async function updateAdminBriefing(id, fields) {
  const {
    id: ignoredId,
    created_at,
    updated_at,
    order_number,
    user_id,
    ...payloadFields
  } = fields
  const payload = {
    ...payloadFields,
    updated_at: new Date().toISOString(),
  }

  if (!payload.logo_file) delete payload.logo_file
  if (!Array.isArray(payload.page_images) || payload.page_images.length === 0) {
    delete payload.page_images
  }

  const rows = await restRequest(`/briefings?id=eq.${id}&select=*`, {
    method: 'PATCH',
    body: payload,
    prefer: 'return=representation',
  })
  return rows?.[0]
}

export async function deleteAdminBriefing(id) {
  await restRequest(`/briefings?id=eq.${id}`, { method: 'DELETE' })
}

export function getSupabaseProjectInfo() {
  return {
    url: SUPABASE_BASE_URL,
    restUrl: SUPABASE_REST_URL,
  }
}
