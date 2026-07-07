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

export default function App() {
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
