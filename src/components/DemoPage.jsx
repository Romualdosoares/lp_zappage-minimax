import { useEffect } from 'react'
import { getDemo } from '../data/demos'
import { buildWhatsappUrl } from '../siteConfig'
import { trackMarketingEvent } from '../lib/marketingTracking'
import { trackAnalyticsEvent } from '../lib/supabaseClient'
import { IconArrowRight, IconCheckCircle, IconWhatsapp } from './Icons'

export default function DemoPage({ demoId }) {
  const demo = getDemo(demoId)

  useEffect(() => {
    if (!demo) return
    document.title = `${demo.name} | Demonstração Zap Page`
    trackMarketingEvent('page_view', { label: `Demonstração: ${demo.name}` })
  }, [demo])

  useEffect(() => {
    function handleClick(event) {
      const element = event.target.closest?.('a, button')
      if (!element) return
      const href = element.getAttribute('href') || ''
      const label = element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 90) || 'CTA'
      const ctaLocation = element.dataset.ctaLocation || 'demo'
      const eventName = href.includes('wa.me') ? 'whatsapp_click' : href ? 'demo_click' : 'button_click'
      trackAnalyticsEvent(eventName, { label, metadata: { href, cta_location: ctaLocation } })
      trackMarketingEvent(eventName, { label, ctaLocation })
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!demo) return null

  const whatsappUrl = buildWhatsappUrl(`Vi a demonstração ${demo.name} e quero um modelo semelhante para o meu negócio.`)

  return (
    <div className="min-h-screen bg-[#071007] text-white">
      <div className={`pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b ${demo.palette} opacity-[0.12]`} />
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
          <a href="/" className="text-sm font-extrabold text-white">← Zap Page</a>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-white/90">Demonstração</span>
        </div>
      </header>

      <main>
        <section className="container-page py-12 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/70">{demo.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{demo.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{demo.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#servicos" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black">Conhecer serviços</a>
                <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" data-cta-location="demo-hero" className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white">
                  <IconWhatsapp className="mr-2 inline h-4 w-4" />Agendar pelo WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/25 bg-black/25 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="rounded-[1.4rem] border border-white/20 bg-[#101510] p-5 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">{demo.category}</p>
                <h2 className="mt-2 text-3xl font-black">{demo.name}</h2>
                <div className={`mt-6 h-36 rounded-2xl bg-gradient-to-br ${demo.palette} p-5`}>
                  <p className="text-sm font-bold text-black/75">Atendimento pensado para você</p>
                  <p className="mt-2 max-w-48 text-xl font-black leading-tight text-black">Informações importantes em um só lugar.</p>
                </div>
                <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" data-cta-location="demo-preview" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#38f214] px-4 py-3 text-sm font-extrabold text-black">
                  <IconWhatsapp className="h-5 w-5" />Falar agora
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="border-y border-white/10 bg-black/25 py-14 sm:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">Estrutura de demonstração</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">O que o cliente encontra sem precisar perguntar.</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
              {demo.services.map((service, index) => (
                <article key={service} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <span className="text-sm font-black text-[#6fff4e]">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-bold">{service}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">Apresentação objetiva com um convite claro para tirar dúvidas ou agendar.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-white/15 bg-black/25 p-7 sm:grid-cols-2 sm:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">Por que funciona</p>
              <h2 className="mt-3 text-3xl font-black">Um caminho simples até a conversa.</h2>
            </div>
            <ul className="space-y-4">
              {demo.benefits.map(item => <li key={item} className="flex items-center gap-3 text-sm text-white/80"><IconCheckCircle className="h-5 w-5 shrink-0 text-[#6fff4e]" />{item}</li>)}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/35 py-8">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/65">Esta é uma demonstração criada pela Zap Page.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" data-cta-location="demo-footer" className="inline-flex items-center gap-2 rounded-xl bg-[#38f214] px-5 py-3 text-sm font-extrabold text-black">
            Quero um modelo semelhante <IconArrowRight className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  )
}
