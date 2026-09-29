import { IconArrowRight } from './Icons'

// Sem categoria confirmada nos registros do portfólio, a landing apresenta
// uma demonstração explícita. A rota do portfólio gerenciado continua intacta.
export default function PortfolioSection() {
  return (
    <section id="portfolio" className="barber-section barber-example" aria-labelledby="portfolio-title">
      <div className="container-page barber-example-grid">
        <div data-reveal>
          <p className="barber-eyebrow">Veja uma demonstração</p>
          <h2 id="portfolio-title">A próxima página<br />pode ter <span className="text-gradient-neon">a sua marca.</span></h2>
          <p className="barber-example-description">Explore uma demonstração de barbearia e conheça como serviços, apresentação e contato podem funcionar juntos.</p>
          <ul className="barber-example-list"><li>Identidade visual da sua barbearia</li><li>Seus cortes, serviços e diferenciais</li><li>Contato e agendamento fáceis de encontrar</li></ul>
          <a href="/demonstracoes/barbearia" className="btn-primary" data-analytics-event="portfolio_click" data-cta-location="landing-barber-demo">Explorar demonstração <IconArrowRight className="h-4 w-4" /></a>
          <p className="barber-example-note">Modelo demonstrativo. Textos, cores e conteúdo são personalizados no seu projeto.</p>
        </div>
        <figure data-reveal className="barber-example-preview">
          <img
            src="/assets/barbershop/chair-atelier-gold.webp"
            alt="Interior de barbearia com cadeira em couro preto e detalhes dourados"
            width="1280"
            height="853"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Demonstração de página para barbearia</figcaption>
        </figure>
      </div>
    </section>
  )
}
