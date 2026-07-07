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
    title: 'Escolha seu plano',
    text: 'Você escolhe entre Express, Profissional ou Turbo Vendas.',
  },
  {
    num: '02',
    icon: IconDevice,
    title: 'Envie suas informações',
    text: 'Nome do negócio, WhatsApp, cidade, serviços, fotos, logo e principais diferenciais.',
  },
  {
    num: '03',
    icon: IconRocket,
    title: 'Nós criamos sua página',
    text: 'Organizamos as informações em uma página bonita, clara e otimizada para celular.',
  },
  {
    num: '04',
    icon: IconCheckCircle,
    title: 'Você revisa e aprova',
    text: 'Ajustamos os detalhes necessários para deixar a página alinhada ao seu negócio.',
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
            Um processo simples para você sair do improviso e começar a
            divulgar um link profissional.
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
          Pronto. No fim, você tem um link profissional para divulgar.
        </div>
      </div>
    </section>
  )
}
