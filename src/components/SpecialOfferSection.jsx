import { buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import {
  IconArrowRight,
  IconBolt,
  IconShield,
  IconCheckCircle,
  IconSparkles,
} from './Icons'

const BULLETS = [
  'Planos objetivos, com entregáveis descritos antes da contratação',
  'Atendimento pelo WhatsApp para indicar a melhor estrutura',
  'Entrega de 3 a 5 dias e 3 revisões incluídas',
]

export default function SpecialOfferSection() {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="offer-title">
      <div className="container-page">
        <div className="card-animated-slow relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-bg-cardPremium p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid opacity-10"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="badge-neon mb-4">
                <IconSparkles className="h-3.5 w-3.5" /> Escolha com segurança
              </span>
              <h2
                id="offer-title"
                className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                Decida seu plano com{' '}
                <span className="text-gradient-neon text-glow">
                  clareza antes de iniciar.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base text-ink-light sm:text-lg">
                Você não precisa adivinhar qual opção faz sentido. Conte sobre
                seu negócio no WhatsApp e confirme a estrutura mais adequada{' '}
                <strong className="font-bold text-white">
                  antes de seguir para o briefing e produção
                </strong>{' '}
                e produção da página.
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
              <div className="rounded-2xl border border-white/10 bg-bg-primary/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon">
                  <IconBolt className="h-4 w-4" /> Planos a partir de
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">
                    R$197
                  </span>
                  <span className="text-sm text-ink-light">/a partir de</span>
                </div>
                <p className="mt-3 text-sm text-ink-light">
                  Informe seu segmento e objetivo. Após a confirmação do
                  pagamento, sua página é entregue de 3 a 5 dias.
                </p>
                <a
                  href={buildWhatsappUrl(whatsappMessages.recommendation)}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cta-location="decision-guide"
                  className="btn-primary mt-5 w-full animate-pulse-glow"
                >
                  Receber recomendação
                  <IconArrowRight className="h-5 w-5" />
                </a>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-light">
                  <IconShield className="h-3.5 w-3.5 text-neon" />
                  A conversa não inicia a contratação automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
