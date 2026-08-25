import { useEffect, useState } from 'react'
import {
  hasMarketingConsent,
  initializeMarketingTracking,
  isMarketingConfigured,
  saveMarketingConsent,
  trackMarketingEvent,
} from '../lib/marketingTracking'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isMarketingConfigured()) return
    const stored = window.localStorage.getItem('zapPage.marketingConsent.v1')
    if (!stored) setVisible(true)
    else if (hasMarketingConsent()) {
      let idleId
      let timerId
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(initializeMarketingTracking, { timeout: 2200 })
      } else {
        timerId = window.setTimeout(initializeMarketingTracking, 1200)
      }
      return () => {
        if (idleId) window.cancelIdleCallback(idleId)
        if (timerId) window.clearTimeout(timerId)
      }
    }
    return undefined
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('cookie-consent-visible', visible)
    return () => document.documentElement.classList.remove('cookie-consent-visible')
  }, [visible])

  function chooseConsent(value) {
    saveMarketingConsent(value)
    setVisible(false)
    if (value) {
      initializeMarketingTracking()
      trackMarketingEvent('page_view', { label: document.title })
    }
  }

  if (!visible) return null

  return (
    <aside data-cookie-consent className="fixed bottom-3 left-3 right-3 z-[70] mx-auto max-w-xl rounded-2xl border border-neon/35 bg-bg-cardPremium p-5 shadow-neon sm:bottom-5 sm:left-5 sm:right-auto">
      <p className="text-sm font-bold text-white">Cookies de métricas e marketing</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-light">
        Usamos Google Analytics e Meta Pixel, se configurados, para medir acessos e interações. Você pode aceitar ou recusar sem perder o acesso à página.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => chooseConsent(true)} className="btn-primary px-4 py-2 text-sm">
          Aceitar
        </button>
        <button type="button" onClick={() => chooseConsent(false)} className="btn-secondary px-4 py-2 text-sm">
          Recusar
        </button>
      </div>
    </aside>
  )
}
