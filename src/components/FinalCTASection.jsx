import { buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import {
  IconArrowRight,
  IconCheckCircle,
  IconWhatsapp,
  IconRocket,
} from './Icons'

const BULLETS = [
  'Um link para concentrar sua oferta',
  'Mais clareza para o cliente decidir',
  'Botões diretos para o seu WhatsApp',
  'Planos a partir de R$197',
  'Entrega de 3 a 5 dias e 3 revisões incluídas',
]

export default function FinalCTASection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      aria-labelledby="final-cta-title"
    >
      {/* Glow — mais discreto */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[45%] w-[65%] -translate-x-1/2 -translate-y-1/2 bg-radial-green opacity-12 sm:block"
      />

      <div className="container-page relative">
        <div data-reveal="scale" className="card-animated-slow relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-bg-cardPremium p-8 sm:p-12">
          <div data-reveal-group className="relative grid items-center gap-8 lg:grid-cols-5">
            <div data-reveal-item className="lg:col-span-3">
              <h2
                id="final-cta-title"
                className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]"
              >
                Pare de explicar tudo em mensagens{' '}
                <span className="text-gradient-neon text-glow">
                  soltas no WhatsApp.
                </span>
              </h2>
              <p className="mt-5 text-base text-ink-light sm:text-lg">
                Dê ao cliente uma página clara para entender sua oferta,
                ganhar confiança e chegar ao seu WhatsApp mais preparado para
                contratar.
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
                  href={buildWhatsappUrl(whatsappMessages.recommendation)}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cta-location="final-cta"
                  className="btn-primary"
                >
                  <IconWhatsapp className="h-5 w-5" />
                  Quero confirmar meu plano
                </a>
                <a href="#planos" data-cta-location="final-plans" className="btn-secondary">
                  Comparar planos
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-light">
                <IconRocket className="h-4 w-4 text-neon" />
                Você confirma o plano no WhatsApp. Após o pagamento, recebe o
                briefing e sua página é entregue em 3 a 5 dias.
              </p>
            </div>

            {/* Selo lateral */}
            <div data-reveal-item className="lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-bg-primary/70 p-6 text-center backdrop-blur-xl">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon text-bg-primary">
                  <IconWhatsapp className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Atendimento pelo WhatsApp
                </h3>
                <p className="mt-2 text-sm text-ink-light">
                  Conte seu segmento, confirme o plano e receba a orientação
                  para iniciar seu projeto.
                </p>
                <a
                  href={buildWhatsappUrl(whatsappMessages.general)}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cta-location="final-whatsapp-card"
                  className="btn-primary mt-5 w-full"
                >
                  Receber orientação no WhatsApp
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
