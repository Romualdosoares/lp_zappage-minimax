import { useEffect } from 'react'
import TopOfferBar from './components/TopOfferBar.jsx'
import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import ProblemSection from './components/ProblemSection.jsx'
import TestimonialsSection from './components/TestimonialsSection.jsx'
import DeliverablesSection from './components/DeliverablesSection.jsx'
import HowItWorksSection from './components/HowItWorksSection.jsx'
import PricingSection from './components/PricingSection.jsx'
import FAQSection from './components/FAQSection.jsx'
import FinalCTASection from './components/FinalCTASection.jsx'
import Footer from './components/Footer.jsx'
import StickyWhatsAppButton from './components/StickyWhatsAppButton.jsx'
import MobileStickyCTA from './components/MobileStickyCTA.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import PortfolioSection from './components/PortfolioSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import ScrollExperience from './components/ScrollExperience.jsx'
import { trackAnalyticsEvent } from './lib/supabaseClient.js'
import { trackMarketingEvent } from './lib/marketingTracking.js'

export default function App() {
  useEffect(() => {
    const trackInitialPageView = () => {
      trackAnalyticsEvent('page_view', { label: 'Landing page' })
      trackMarketingEvent('page_view', { label: 'Landing page' })
    }
    let initialTrackingId
    let initialTrackingTimer

    if ('requestIdleCallback' in window) {
      initialTrackingId = window.requestIdleCallback(trackInitialPageView, { timeout: 1800 })
    } else {
      initialTrackingTimer = window.setTimeout(trackInitialPageView, 900)
    }

    function handleTrackedClick(event) {
      const element = event.target.closest?.('a, button')
      if (!element || element.closest('[data-cookie-consent]')) return

      const href = element.getAttribute('href') || ''
      const label = element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 90) || element.getAttribute('aria-label') || 'CTA'
      const planName = element.dataset.planName || ''
      const ctaLocation = element.dataset.ctaLocation || ''
      const explicitEvent = element.dataset.analyticsEvent
      let eventName = explicitEvent || 'button_click'

      if (!explicitEvent && href.includes('wa.me')) eventName = 'whatsapp_click'
      else if (!explicitEvent && href && href !== '#' && !href.startsWith('#')) eventName = 'outbound_click'
      else if (!explicitEvent && href.startsWith('#')) eventName = 'cta_click'

      trackAnalyticsEvent(eventName, {
        label,
        plan_name: planName,
        metadata: { href, cta_location: ctaLocation },
      })
      trackMarketingEvent(eventName, { label, planName, ctaLocation })
    }

    document.addEventListener('click', handleTrackedClick)
    return () => {
      document.removeEventListener('click', handleTrackedClick)
      if (initialTrackingId) window.cancelIdleCallback(initialTrackingId)
      if (initialTrackingTimer) window.clearTimeout(initialTrackingTimer)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-primary text-white">
      <ScrollExperience />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-futuristic-dense" />
      <TopOfferBar />
      <Header />

      <main id="top">
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <DeliverablesSection />
        <PortfolioSection />
        <AboutSection />
        <TestimonialsSection />
        <PricingSection />
        <HowItWorksSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
      <StickyWhatsAppButton />
      <MobileStickyCTA />
      <CookieConsent />
    </div>
  )
}
