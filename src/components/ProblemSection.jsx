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
    title: 'Seu corte impressiona. Seu link também?',
    text: 'As fotos mostram seu trabalho. Uma página reúne cortes, barba, serviços, localização e como falar com sua barbearia.',
  },
  {
    icon: IconWhatsapp,
    title: 'As mesmas perguntas, todo dia',
    text: 'Preço do corte, horário e endereço: deixe as informações em um link fácil de consultar antes da conversa.',
  },
  {
    icon: IconShield,
    title: 'Sua identidade merece espaço',
    text: 'Mostre o ambiente, a equipe e o estilo da sua barbearia em uma apresentação que combina com sua marca.',
  },
  {
    icon: IconQuestion,
    title: 'O próximo passo precisa estar claro',
    text: 'Botões levam ao seu WhatsApp ou ao sistema de agendamento que você já usa, sem o cliente precisar procurar.',
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
        <div data-reveal className="max-w-4xl">
          <span className="badge-neon">
            <IconQuestion className="h-3.5 w-3.5" /> Do perfil ao contato
          </span>
          <h2
            id="problem-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Sua barbearia tem estilo.{' '}
            <span className="text-gradient-neon">Mostre isso no primeiro clique.</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Dê a quem chega pelo Instagram ou por uma indicação um lugar
            para conhecer seu trabalho, encontrar as informações e entrar em contato.
          </p>
        </div>

        {/* Grid */}
        <div data-reveal-group className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-6">
          {CARDS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              data-reveal-item
              className="card-base group"
            >
              {/* Glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-neon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20">
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
        <div data-reveal className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-ink-light">
            <IconRocket className="h-4 w-4 text-neon" />
            Seu trabalho bem apresentado. Seu contato fácil de encontrar.
          </p>
        </div>
      </div>
    </section>
  )
}
