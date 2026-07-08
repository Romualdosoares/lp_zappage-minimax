import { useEffect } from 'react'
import TopOfferBar from './components/TopOfferBar.jsx'
import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import ProblemSection from './components/ProblemSection.jsx'
import TransformationSection from './components/TransformationSection.jsx'
import DeliverablesSection from './components/DeliverablesSection.jsx'
import SupportSection from './components/SupportSection.jsx'
import NichesSection from './components/NichesSection.jsx'
import HowItWorksSection from './components/HowItWorksSection.jsx'
import SpecialOfferSection from './components/SpecialOfferSection.jsx'
import PricingSection from './components/PricingSection.jsx'
import PlanComparisonSection from './components/PlanComparisonSection.jsx'
import BonusSection from './components/BonusSection.jsx'
import ObjectionsSection from './components/ObjectionsSection.jsx'
import FAQSection from './components/FAQSection.jsx'
import FinalCTASection from './components/FinalCTASection.jsx'
import Footer from './components/Footer.jsx'
import StickyWhatsAppButton from './components/StickyWhatsAppButton.jsx'
import MobileStickyCTA from './components/MobileStickyCTA.jsx'
import { trackAnalyticsEvent } from './lib/supabaseClient.js'

export default function App() {
  useEffect(() => {
    trackAnalyticsEvent('page_view', { label: 'Página de vendas' })

    function handleTrackedClick(event) {
      const link = event.target.closest?.('a')
      if (!link) return

      const href = link.getAttribute('href') || ''
      const label = link.textContent?.replace(/\s+/g, ' ').trim().slice(0, 90) || 'CTA'
      const planName = link.dataset.planName || ''
      const explicitEvent = link.dataset.analyticsEvent

      if (explicitEvent) {
        trackAnalyticsEvent(explicitEvent, {
          label,
          plan_name: planName,
          metadata: { href },
        })
        return
      }

      if (href.includes('wa.me')) {
        trackAnalyticsEvent('whatsapp_click', {
          label,
          plan_name: planName,
          metadata: { href },
        })
      } else if (href === '#planos') {
        trackAnalyticsEvent('cta_click', {
          label,
          metadata: { href, target: 'planos' },
        })
      } else if (href && href !== '#' && !href.startsWith('#')) {
        trackAnalyticsEvent('outbound_click', {
          label,
          metadata: { href },
        })
      }
    }

    document.addEventListener('click', handleTrackedClick)
    return () => document.removeEventListener('click', handleTrackedClick)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-primary text-white">
      {/* Gradiente fixo de fundo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-futuristic-dense"
      />

      <TopOfferBar />
      <Header />

      <main id="top">
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <TransformationSection />
        <DeliverablesSection />
        <SupportSection />
        <NichesSection />
        <HowItWorksSection />
        <SpecialOfferSection />
        <PricingSection />
        <PlanComparisonSection />
        <BonusSection />
        <ObjectionsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />

      {/* Floating + Sticky CTAs */}
      <StickyWhatsAppButton />
      <MobileStickyCTA />
    </div>
  )
}
