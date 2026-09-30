import { useEffect, useState } from 'react'
import { IconArrowRight } from './Icons'
import PortfolioImage from './PortfolioImage'
import useNearViewport from '../hooks/useNearViewport'
import { getClientSites, subscribeToClientSites } from '../lib/supabaseClient'
import { createPortfolioFeed } from '../lib/portfolioFeed'

export default function PortfolioSection() {
  const [sectionRef, shouldLoad] = useNearViewport('900px 0px')
  const [sites, setSites] = useState(null)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!shouldLoad) return undefined
    const feed = createPortfolioFeed({
      load: () => getClientSites({ landing: true, limit: 6 }),
      subscribe: subscribeToClientSites,
      onData: rows => { setSites(rows); setFailed(false) },
      onError: () => setFailed(true),
    })
    const refreshVisible = () => {
      if (document.visibilityState === 'visible') feed.refresh()
    }
    const timer = window.setInterval(refreshVisible, 30000)
    window.addEventListener('focus', refreshVisible)
    window.addEventListener('online', refreshVisible)
    document.addEventListener('visibilitychange', refreshVisible)
    return () => {
      feed.dispose()
      window.clearInterval(timer)
      window.removeEventListener('focus', refreshVisible)
      window.removeEventListener('online', refreshVisible)
      document.removeEventListener('visibilitychange', refreshVisible)
    }
  }, [shouldLoad, retry])

  return (
    <section ref={sectionRef} id="portfolio" className="barber-section barber-portfolio" aria-labelledby="portfolio-title">
      <div className="container-page">
        <div className="barber-portfolio-heading" data-reveal>
          <div>
            <p className="barber-eyebrow">Portfólio · Trabalhos realizados</p>
            <h2 id="portfolio-title">Marcas que já têm<br /><span className="text-gradient-neon">seu espaço online.</span></h2>
            <p className="barber-example-description">Conheça os projetos selecionados do nosso portfólio. Abra cada site e explore os detalhes.</p>
          </div>
          <a href="/portfolio" className="btn-secondary">Ver portfólio completo <IconArrowRight className="h-4 w-4" /></a>
        </div>
        <p className="sr-only" role="status">{sites ? `${sites.length} projetos em destaque.` : failed ? 'Falha ao carregar o portfólio.' : 'Carregando portfólio.'}</p>
        {failed && (
          <div className="barber-portfolio-status" role="alert">
            <p>{sites ? 'Não foi possível atualizar os projetos agora.' : 'Não foi possível carregar os projetos agora.'}</p>
            <button type="button" className="btn-secondary" onClick={() => { setFailed(false); setRetry(value => value + 1) }}>Tentar novamente</button>
          </div>
        )}
        {!sites && !failed && (
          <div className="barber-portfolio-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="barber-portfolio-skeleton" />)}
          </div>
        )}
        {sites?.length === 0 && (
          <div className="barber-portfolio-status">
            <p>Em breve, novos projetos por aqui. Enquanto isso, conheça uma demonstração.</p>
            <a href="/demonstracoes/barbearia" className="btn-secondary">Explorar demonstração <IconArrowRight className="h-4 w-4" /></a>
          </div>
        )}
        {sites?.length > 0 && (
          <div className="barber-portfolio-grid">
            {sites.map(site => (
              <article key={site.id} className="barber-portfolio-card" data-reveal>
                <PortfolioImage site={site} />
                <p className="barber-portfolio-label">Site desenvolvido</p>
                <h3>{site.company_name}</h3>
                <p className="barber-portfolio-domain">{new URL(site.site_url).hostname.replace(/^www\./, '')}</p>
                <a href={site.site_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" aria-label={`Visitar site de ${site.company_name} (abre em nova aba)`} data-analytics-event="portfolio_click" data-cta-location="landing-portfolio" data-project-id={site.id}>
                  Visitar site <IconArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
