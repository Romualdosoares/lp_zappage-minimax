import {
  IconRocket,
  IconCheckCircle,
  IconLink,
  IconShield,
  IconCopy,
  IconDevice,
  IconStar,
  IconSparkles,
  IconChart,
  IconWhatsapp,
} from './Icons'

const ITEMS = [
  {
    icon: IconRocket,
    title: 'Apresentação do negócio',
    text: 'Uma seção clara explicando quem você é e o que oferece.',
  },
  {
    icon: IconCheckCircle,
    title: 'Lista de serviços',
    text: 'Organização dos seus principais serviços, produtos ou especialidades.',
  },
  {
    icon: IconWhatsapp,
    title: 'Botões de WhatsApp',
    text: 'Chamadas estratégicas para o cliente falar com você.',
  },
  {
    icon: IconStar,
    title: 'Benefícios e diferenciais',
    text: 'Mostre por que o cliente deve escolher seu negócio.',
  },
  {
    icon: IconDevice,
    title: 'Fotos e identidade visual',
    text: 'Use imagens, cores e informações que reforçam sua marca.',
  },
  {
    icon: IconLink,
    title: 'Link pronto para divulgar',
    text: 'Use na bio do Instagram, WhatsApp, anúncios e cartão digital.',
  },
  {
    icon: IconShield,
    title: 'Layout responsivo',
    text: 'A página fica bonita no celular, tablet e computador.',
  },
  {
    icon: IconCopy,
    title: 'Copy persuasiva',
    text: 'Textos pensados para explicar melhor sua oferta e gerar ação.',
  },
]

export default function DeliverablesSection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      aria-labelledby="deliverables-title"
    >
      <div className="container-page">
        <div data-reveal className="max-w-4xl">
          <span className="badge-neon">
            <IconSparkles className="h-3.5 w-3.5" /> Entregáveis
          </span>
          <h2
            id="deliverables-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            O que sua página{' '}
            <span className="text-gradient-neon">pode incluir</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Cada plano reúne os elementos certos para explicar sua oferta,
            transmitir confiança e direcionar visitantes ao WhatsApp.
          </p>
        </div>

        {/* Grid */}
        <div data-reveal-group className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              data-reveal-item
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg-card p-5 transition-[border-color,background-color] duration-300 hover:border-neon/30 hover:bg-bg-cardPremium"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-light">
                {text}
              </p>
              {/* Detalhe */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-0 bg-neon transition-all duration-500 group-hover:w-full"
              />
            </article>
          ))}
        </div>

        {/* Subtítulo extra com confiança */}
        <div data-reveal className="mt-14 flex items-center justify-center gap-2 text-sm text-ink-light">
          <IconChart className="h-5 w-5 text-neon" />
          Os itens incluídos variam conforme o plano escolhido. Confira os
          detalhes antes de contratar.
        </div>
      </div>
    </section>
  )
}
