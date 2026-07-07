import { buildWhatsappUrl } from '../siteConfig'
import {
  IconArrowRight,
  IconCheckCircle,
  IconWhatsapp,
  IconRocket,
} from './Icons'

const BULLETS = [
  'Página pronta para divulgar',
  'Visual profissional',
  'Botão direto para WhatsApp',
  'Planos a partir de R$197',
  'Suporte guiado nos planos principais',
]

export default function FinalCTASection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      aria-labelledby="final-cta-title"
    >
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-radial-green opacity-70"
      />

      <div className="container-page relative">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-neon/40 bg-bg-cardPremium p-8 shadow-neon sm:p-12">
          {/* Brilhos */}
          <div
            aria-hidden
            className="absolute -left-16 -top-16 h-60 w-60 rounded-full bg-neon/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -right-16 -bottom-16 h-60 w-60 rounded-full bg-neon-secondary/15 blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2
                id="final-cta-title"
                className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]"
              >
                Seu negócio merece uma apresentação{' '}
                <span className="text-gradient-neon text-glow">
                  mais profissional.
                </span>
              </h2>
              <p className="mt-5 text-base text-ink-light sm:text-lg">
                Pare de depender de mensagens soltas e links improvisados.
                Tenha uma página clara, bonita e pronta para levar clientes
                direto ao seu WhatsApp.
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={buildWhatsappUrl('Quero minha página agora')}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary animate-pulse-glow"
                >
                  <IconWhatsapp className="h-5 w-5" />
                  Quero minha página agora
                </a>
                <a href="#planos" className="btn-secondary">
                  Comparar planos
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-light">
                <IconRocket className="h-4 w-4 text-neon" />
                Escolha o plano, envie suas informações e comece a divulgar com
                mais profissionalismo.
              </p>
            </div>

            {/* Selo lateral */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-neon/40 bg-bg-primary/70 p-6 text-center backdrop-blur-xl">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon text-bg-primary shadow-neon">
                  <IconWhatsapp className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Atendimento pelo WhatsApp
                </h3>
                <p className="mt-2 text-sm text-ink-light">
                  Toque no botão, converse com a gente e comece hoje.
                </p>
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary mt-5 w-full"
                >
                  Falar no WhatsApp agora
                  <IconWhatsapp className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
