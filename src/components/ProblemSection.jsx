import {
  IconDevice,
  IconWhatsapp,
  IconShield,
  IconQuestion,
  IconRocket,
} from './Icons'

const CARDS = [
  {
    icon: IconDevice,
    title: 'Instagram não explica tudo',
    text: 'Seu perfil pode até mostrar fotos, mas nem sempre deixa claro seus serviços, preços, localização e forma de atendimento.',
  },
  {
    icon: IconWhatsapp,
    title: 'WhatsApp bagunçado perde venda',
    text: 'Mandar várias mensagens, fotos e áudios toda vez cansa você e confunde o cliente.',
  },
  {
    icon: IconShield,
    title: 'Pouca confiança',
    text: 'Sem uma página bem apresentada, seu negócio pode parecer menor ou menos profissional do que realmente é.',
  },
  {
    icon: IconQuestion,
    title: 'Contato sem direção',
    text: 'Se o cliente não encontra rápido onde clicar, o que pedir ou como falar com você, ele procura outro.',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="beneficios"
      className="relative py-20 sm:py-28"
      aria-labelledby="problem-title"
    >
      <div className="container-page">
        {/* Cabeçalho */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconQuestion className="h-3.5 w-3.5" /> O problema
          </span>
          <h2
            id="problem-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Seu cliente decide rápido se{' '}
            <span className="text-gradient-neon">confia ou não</span> no seu
            negócio.
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Quando sua apresentação é confusa, improvisada ou depende apenas
            de mensagens soltas, o cliente pode desistir antes mesmo de pedir
            orçamento.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-6">
          {CARDS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-base group"
            >
              {/* Glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-neon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20 group-hover:shadow-neon-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">
                {text}
              </p>
            </article>
          ))}
        </div>

        {/* Pequena chamada de saída */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-ink-light">
            <IconRocket className="h-4 w-4 text-neon" />
            A solução está a um link de distância.
          </p>
        </div>
      </div>
    </section>
  )
}
