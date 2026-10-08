import usePlanPrices from '../hooks/usePlanPrices.js'
import { buildWhatsappUrl, siteConfig, whatsappMessages } from '../siteConfig'
import { IconArrowRight, IconCheck, IconWhatsapp } from './Icons'

export default function HeroSection() {
  const prices = usePlanPrices()
  return (
    <section className="barber-hero" aria-labelledby="hero-title">
      <img
        className="barber-hero-image"
        src="/assets/barbershop/hero-atelier-gold.webp"
        alt="Ferramentas de barbearia sobre uma bancada escura com iluminação dourada"
        width="1672"
        height="941"
        decoding="async"
      />
      <div className="barber-hero-shade" aria-hidden="true" />
      <div className="container-page barber-hero-grid">
        <div className="barber-hero-copy">
          <p className="barber-eyebrow"><span aria-hidden="true" /> Páginas especializadas em barbearias</p>
          <h1 id="hero-title">Sua barbearia<br />merece <span>destaque.</span></h1>
          <p className="barber-hero-lead">Uma presença digital à altura do seu trabalho.</p>
          <p className="barber-hero-description">Página profissional, bio personalizada e criativos nos planos Profissional e Turbo. Tudo com a identidade da sua barbearia, pronto para você divulgar.</p>
          <div className="barber-hero-actions">
            <a href={buildWhatsappUrl(whatsappMessages.recommendation)} target="_blank" rel="noreferrer noopener" data-cta-location="hero" className="btn-primary">
              Criar minha página <IconWhatsapp className="h-5 w-5 shrink-0" />
            </a>
            <a href="#planos" data-cta-location="hero-plans" className="btn-secondary">Ver planos <IconArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="barber-hero-details">
            <span><IconCheck className="h-4 w-4" /> Bio personalizada em todos os planos</span>
            <span>A partir de <strong>{prices.express.price}</strong> à vista</span>
          </div>
        </div>
      </div>
      <div className="container-page barber-hero-bottom">
        <p>Da primeira impressão ao <strong>próximo contato.</strong></p>
        <a href="#entregas">Conheça o que você recebe <IconArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  )
}
