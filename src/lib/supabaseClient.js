const SUPABASE_REST_URL = 'https://yeqcojnwxxpffvfxoiwc.supabase.co/rest/v1'
const SUPABASE_BASE_URL = 'https://yeqcojnwxxpffvfxoiwc.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcWNvam53eHhwZmZ2ZnhvaXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDQ2MzEsImV4cCI6MjA5OTA4MDYzMX0.m0u1v3TSRBpmxoJm5CJj71o6i7bW1_CVzvCDy4vZVmQ'

const SESSION_KEY = 'zapPage.supabaseSession.v1'
const BRIEFING_ASSETS_BUCKET = 'briefing-assets'

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

async function parseResponse(response) {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.msg || data?.message || data?.error_description || data?.hint || 'Erro no Supabase.'
    throw new Error(message)
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

async function restRequest(path, { method = 'GET', body, token, prefer } = {}) {
  const response = await fetch(`${SUPABASE_REST_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || getSession()?.access_token || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  return parseResponse(response)
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
  const session = getSession()
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

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    path,
    url: `${SUPABASE_BASE_URL}/storage/v1/object/public/${BRIEFING_ASSETS_BUCKET}/${path}`,
    uploaded_at: new Date().toISOString(),
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
  const session = getSession()
  if (!session?.user?.id) return null
  const rows = await restRequest(
    `/profiles?select=*&id=eq.${session.user.id}&limit=1`,
    { token: session.access_token },
  )
  return rows?.[0] || null
}

export async function getPortfolioServices({ admin = false } = {}) {
  const filter = admin ? '' : '&status=eq.Ativo'
  const rows = await restRequest(
    `/portfolio_services?select=*&order=featured.desc,created_at.desc${filter}`,
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

export async function getBriefingsForAdmin() {
  return restRequest('/briefings?select=*&order=updated_at.desc')
}

export async function getBriefingByOrder(orderNumber) {
  const safeOrder = String(orderNumber || '').replace(/\D/g, '')
  if (!safeOrder) throw new Error('Numero da ordem invalido.')

  const rows = await restRequest(`/briefings?select=*&order_number=eq.${safeOrder}&limit=1`)
  return rows?.[0] || null
}

export async function getMyBriefing() {
  const session = getSession()
  if (!session?.user?.id) return null
  const rows = await restRequest(`/briefings?select=*&user_id=eq.${session.user.id}&limit=1`)
  return rows?.[0] || null
}

export async function saveMyBriefing(form, status) {
  const session = getSession()
  if (!session?.user?.id) throw new Error('Sessão inválida.')

  const { id, created_at, order_number, ...clientFields } = form
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

export function getSupabaseProjectInfo() {
  return {
    url: SUPABASE_BASE_URL,
    restUrl: SUPABASE_REST_URL,
  }
}
