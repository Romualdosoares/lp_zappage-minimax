import {
  IconHeadset,
  IconChart,
  IconCheckCircle,
  IconRocket,
  IconShield,
} from './Icons'

const CARDS = [
  {
    icon: IconHeadset,
    title: 'Suporte técnico',
    text: 'Ajudamos com dúvidas sobre link, botão de WhatsApp, ajustes e funcionamento da página.',
  },
  {
    icon: IconChart,
    title: 'Orientação comercial',
    text: 'Mostramos como apresentar melhor seus serviços e usar sua página para gerar conversas.',
  },
  {
    icon: IconCheckCircle,
    title: 'Passo a passo guiado',
    text: 'Você entende o que enviar, como divulgar e como aproveitar a estrutura.',
  },
  {
    icon: IconRocket,
    title: 'Preparação para anúncios',
    text: 'No plano Turbo, você recebe criativos e textos para iniciar sua divulgação com mais força.',
  },
]

export default function SupportSection() {
  return (
    <section
      className="relative bg-bg-secondary py-20 sm:py-28"
      aria-labelledby="support-title"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconHeadset className="h-3.5 w-3.5" /> Suporte
          </span>
          <h2
            id="support-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Você não recebe só uma página.{' '}
            <span className="text-gradient-neon">Você recebe direção.</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Nos planos principais, ajudamos você por até 30 dias para
            organizar, divulgar e usar sua página do jeito certo.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {CARDS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-base group"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20 group-hover:shadow-neon-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-light">
                    {text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Nota de honestidade */}
        <div className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-2xl border border-white/10 bg-bg-card/60 p-5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/30 text-neon">
            <IconShield className="h-5 w-5" />
          </span>
          <p className="text-xs leading-relaxed text-ink-light sm:text-sm">
            <strong className="font-bold text-white">Importante:</strong> o
            suporte ajuda você a usar melhor a estrutura, mas os resultados
            dependem do seu mercado, oferta, atendimento, divulgação e tráfego.
          </p>
        </div>
      </div>
    </section>
  )
}
