const CONSENT_KEY = 'zapPage.marketingConsent.v1'

function trackingConfig() {
  return {
    googleId: String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim(),
    metaPixelId: String(import.meta.env.VITE_META_PIXEL_ID || '').trim(),
  }
}

export function isMarketingConfigured() {
  const { googleId, metaPixelId } = trackingConfig()
  return Boolean(googleId || metaPixelId)
}

export function hasMarketingConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function saveMarketingConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value ? 'accepted' : 'declined')
  } catch {
    // O banner permanece funcional mesmo se o navegador bloquear o armazenamento local.
  }
}

function loadScript(id, src) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initializeMarketingTracking() {
  if (!hasMarketingConsent()) return
  const { googleId, metaPixelId } = trackingConfig()

  if (googleId && !window.__zapPageGoogleInitialized) {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', googleId, { anonymize_ip: true, send_page_view: false })
    loadScript('zap-page-google-analytics', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`)
    window.__zapPageGoogleInitialized = true
  }

  if (metaPixelId && !window.__zapPageMetaInitialized) {
    window.fbq = window.fbq || function fbq() { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments) }
    window.fbq.queue = window.fbq.queue || []
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq('init', metaPixelId)
    loadScript('zap-page-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
    window.__zapPageMetaInitialized = true
  }
}

const META_EVENT_BY_NAME = {
  page_view: 'PageView',
  whatsapp_click: 'Contact',
  plan_click: 'Lead',
  demo_click: 'ViewContent',
  portfolio_click: 'ViewContent',
}

export function trackMarketingEvent(eventName, payload = {}) {
  if (!hasMarketingConsent()) return
  initializeMarketingTracking()

  const params = {
    event_category: payload.category || 'engagement',
    event_label: payload.label || '',
    cta_location: payload.ctaLocation || '',
    plan_name: payload.planName || '',
    page_path: window.location.pathname,
  }

  if (typeof window.gtag === 'function') window.gtag('event', eventName, params)

  if (typeof window.fbq === 'function') {
    const metaEvent = META_EVENT_BY_NAME[eventName]
    if (metaEvent === 'PageView') window.fbq('track', metaEvent)
    else if (metaEvent) window.fbq('track', metaEvent, params)
    else window.fbq('trackCustom', eventName, params)
  }
}
