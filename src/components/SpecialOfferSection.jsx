import { buildWhatsappUrl } from '../siteConfig'
import {
  IconArrowRight,
  IconBolt,
  IconShield,
  IconCheckCircle,
  IconSparkles,
} from './Icons'

const BULLETS = [
  'Vagas limitadas por capacidade de produção',
  'Preço especial de lançamento',
  'Atendimento guiado nos planos principais',
]

export default function SpecialOfferSection() {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="offer-title">
      <div className="container-page">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border-2 border-neon/60 bg-bg-cardPremium p-8 shadow-neon-strong sm:p-12">
          {/* Brilhos de fundo */}
          <div
            aria-hidden
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-neon/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-neon-secondary/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid opacity-20"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="badge-neon mb-4 border-neon/70 bg-neon/15 text-neon text-glow-sm">
                <IconSparkles className="h-3.5 w-3.5" /> Oferta de lançamento
              </span>
              <h2
                id="offer-title"
                className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                Condição especial{' '}
                <span className="text-gradient-neon text-glow">
                  de lançamento.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base text-ink-light sm:text-lg">
                Estamos liberando páginas profissionais com WhatsApp{' '}
                <strong className="font-bold text-white">
                  a partir de R$197
                </strong>{' '}
                para negócios locais que querem melhorar sua presença digital
                sem complicação.
              </p>

              <ul className="mt-6 space-y-3">
                {BULLETS.map(b => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-white"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/20 text-neon">
                      <IconCheckCircle className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card de ação */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-neon/40 bg-bg-primary/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon">
                  <IconBolt className="h-4 w-4" /> Vagas abertas
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">
                    R$197
                  </span>
                  <span className="text-sm text-ink-light">/a partir de</span>
                </div>
                <p className="mt-3 text-sm text-ink-light">
                  Comece hoje e receba a página pronta para divulgar.
                </p>
                <a
                  href={buildWhatsappUrl('Quero garantir minha página')}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary mt-5 w-full animate-pulse-glow"
                >
                  Garantir minha página agora
                  <IconArrowRight className="h-5 w-5" />
                </a>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-light">
                  <IconShield className="h-3.5 w-3.5 text-neon" />
                  Sem fidelidade. Suporte humano e direto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
