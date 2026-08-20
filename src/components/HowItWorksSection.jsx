import {
  IconCheckCircle,
  IconDevice,
  IconWhatsapp,
  IconLink,
  IconRocket,
} from './Icons'

const STEPS = [
  {
    num: '01',
    icon: IconCheckCircle,
    title: 'Chame no WhatsApp',
    text: 'Conte seu segmento e como pretende divulgar. Assim indicamos o plano mais adequado.',
  },
  {
    num: '02',
    icon: IconDevice,
    title: 'Confirme o plano',
    text: 'Você confere o que está incluído e confirma os próximos passos antes de iniciar.',
  },
  {
    num: '03',
    icon: IconRocket,
    title: 'Confirme o pagamento e o briefing',
    text: 'Com o pagamento confirmado, você recebe o briefing para enviar nome, serviços, fotos, logo e diferenciais.',
  },
  {
    num: '04',
    icon: IconCheckCircle,
    title: 'Nós criamos e você revisa',
    text: 'Entregamos sua página de 3 a 5 dias após a confirmação do pagamento. Você tem até 3 revisões incluídas.',
  },
  {
    num: '05',
    icon: IconLink,
    title: 'Você começa a divulgar',
    text: 'Use o link no Instagram, WhatsApp, anúncios, cartão digital e materiais de divulgação.',
  },
]

export default function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative bg-bg-secondary py-20 sm:py-28"
      aria-labelledby="how-title"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconRocket className="h-3.5 w-3.5" /> Passo a passo
          </span>
          <h2
            id="how-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Como funciona{' '}
            <span className="text-gradient-neon">na prática</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Do primeiro contato à publicação, você sabe qual é o próximo passo
            e quando enviar cada informação.
          </p>
        </div>

        {/* Steps timeline */}
        <ol className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-5 md:gap-4">
          {STEPS.map((s, idx) => (
            <li
              key={s.num}
              className="relative rounded-2xl border border-neon/25 bg-bg-card p-5 transition-all duration-300 hover:border-neon/60 hover:shadow-neon-sm"
            >
              {/* Linha conectora */}
              {idx < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-1/2 top-full hidden h-5 w-px -translate-x-1/2 bg-gradient-to-b from-neon/60 to-transparent md:block"
                />
              )}

              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neon/40 bg-neon/10 text-sm font-extrabold text-neon">
                  {s.num}
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neon-dark/40 text-neon">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        {/* Selo final */}
        <div className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-3 rounded-full border border-neon/30 bg-bg-primary px-5 py-3 text-sm font-medium text-ink-light">
          <IconWhatsapp className="h-5 w-5 text-neon" />
          No fim, você recebe um link profissional pronto para divulgar.
        </div>
      </div>
    </section>
  )
}
