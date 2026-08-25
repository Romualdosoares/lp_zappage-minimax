import { useEffect, useState } from 'react'
import { getClientSites } from '../lib/supabaseClient'
import useNearViewport from '../hooks/useNearViewport'
import { IconArrowRight, IconLink, IconSparkles } from './Icons'

function getSiteDomain(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}

function getInitials(value) {
  return String(value || 'Site')
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
}

export default function PortfolioSection() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [sectionRef, shouldLoad] = useNearViewport('900px 0px')

  useEffect(() => {
    if (!shouldLoad) return undefined
    let active = true
    getClientSites({ landing: true, limit: 6 })
      .then(rows => {
        if (active) setSites(rows)
      })
      .catch(() => {
        if (active) setSites([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [shouldLoad])

  return (
    <section ref={sectionRef} id="portfolio" className="relative bg-bg-secondary py-20 sm:py-28" aria-labelledby="portfolio-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      <div className="container-page">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <span className="badge-neon"><IconSparkles className="h-3.5 w-3.5" /> Portfólio real</span>
          <h2 id="portfolio-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Páginas criadas para negócios que já estão <span className="text-gradient-neon">no ar.</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Conheça alguns projetos desenvolvidos pela Zap Page. Abra qualquer trabalho para navegar pelo site real.
          </p>
        </div>

        {loading && (
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Carregando projetos">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className={`h-72 rounded-2xl border border-white/10 bg-bg-card ${shouldLoad ? 'animate-pulse motion-reduce:animate-none' : ''}`} />
            ))}
          </div>
        )}

        {!loading && sites.length > 0 && (
          <div data-reveal-group className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map(site => (
              <article key={site.id} data-reveal-item className="portfolio-card-animated group flex min-h-72 flex-col rounded-2xl bg-bg-card transition-transform duration-300 hover:-translate-y-1">
                <div className="rounded-t-2xl border-b border-white/8 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent p-5">
                  <div className="flex items-center gap-1.5" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-red-400/80" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                    <span className="h-2 w-2 rounded-full bg-neon/80" />
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-bg-primary text-lg font-black text-neon">
                      {getInitials(site.company_name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold uppercase tracking-wider text-neon">Projeto publicado</p>
                      <p className="mt-1 truncate text-sm text-ink-light">{getSiteDomain(site.site_url)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold text-white">{site.company_name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-light">Site profissional desenvolvido e publicado pela Zap Page.</p>
                  <a
                    href={site.site_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-analytics-event="portfolio_click"
                    data-cta-location="landing-portfolio-card"
                    className="btn-secondary mt-auto w-full px-4 py-2.5 text-sm"
                  >
                    Visitar projeto <IconArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && sites.length === 0 && (
          <div data-reveal className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-white/15 bg-bg-card p-8 text-center">
            <IconSparkles className="mx-auto h-7 w-7 text-neon" />
            <p className="mt-3 font-bold text-white">Novos projetos serão publicados em breve.</p>
          </div>
        )}

        <div data-reveal className="mt-10 text-center">
          <a href="/portfolio" data-analytics-event="portfolio_click" data-cta-location="landing-portfolio-more" className="btn-primary">
            <IconLink className="h-5 w-5" /> Ver outros projetos <IconArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
