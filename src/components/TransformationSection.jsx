import { buildWhatsappUrl } from '../siteConfig'
import { IconArrowRight, IconClose, IconCheckCircle } from './Icons'

const BEFORE = [
  'Informações espalhadas',
  'Cliente fazendo muitas perguntas',
  'Pouca confiança',
  'Divulgação improvisada',
  'WhatsApp sem organização',
]

const AFTER = [
  'Página profissional com seus serviços',
  'Botão direto para atendimento',
  'Visual que passa confiança',
  'Link único para divulgar',
  'Mais clareza na jornada do cliente',
]

export default function TransformationSection() {
  return (
    <section
      className="relative bg-bg-secondary py-20 sm:py-28"
      aria-labelledby="transform-title"
    >
      {/* Divisor topo */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconCheckCircle className="h-3.5 w-3.5" /> A transformação
          </span>
          <h2
            id="transform-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Agora imagine seu cliente acessando uma página{' '}
            <span className="text-gradient-neon">
              clara, bonita e direta.
            </span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Em poucos segundos ele entende quem você é, o que você oferece,
            por que deve confiar e como chamar você no WhatsApp.
          </p>
        </div>

        {/* Antes x Depois */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          {/* ANTES */}
          <div className="card-base relative overflow-hidden border-red-500/20">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/10 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
                <IconClose className="h-3.5 w-3.5" /> Antes
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">
                Apresentação improvisada
              </h3>
              <ul className="mt-5 space-y-3">
                {BEFORE.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                      <IconClose className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm text-ink-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DEPOIS */}
          <div className="card-base relative overflow-hidden border-neon/50 shadow-neon-sm">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon/15 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/50 bg-neon/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon">
                <IconCheckCircle className="h-3.5 w-3.5" /> Depois
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">
                Apresentação profissional
              </h3>
              <ul className="mt-5 space-y-3">
                {AFTER.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/20 text-neon">
                      <IconCheckCircle className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-medium text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href={buildWhatsappUrl('Quero essa estrutura no meu negócio')}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary animate-pulse-glow"
          >
            Quero essa estrutura no meu negócio
            <IconArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
    </section>
  )
}
