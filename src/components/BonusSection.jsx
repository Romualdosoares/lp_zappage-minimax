import { buildWhatsappUrl } from '../siteConfig'
import {
  IconCheckCircle,
  IconSparkles,
  IconArrowRight,
  IconCopy,
  IconRocket,
  IconChart,
  IconHeadset,
} from './Icons'

const BONUSES = [
  {
    icon: IconCheckCircle,
    title: 'Checklist de informações',
    text: 'Um guia simples para organizar tudo que sua página precisa.',
  },
  {
    icon: IconCopy,
    title: 'Mensagem pronta para WhatsApp',
    text: 'Um texto para divulgar sua nova página para clientes e contatos.',
  },
  {
    icon: IconHeadset,
    title: 'Mini roteiro de atendimento',
    text: 'Um modelo para responder clientes com mais clareza e objetividade.',
  },
  {
    icon: IconChart,
    title: 'Guia rápido de divulgação',
    text: 'Ideias simples para usar sua página no Instagram, WhatsApp e anúncios.',
  },
  {
    icon: IconRocket,
    title: 'Sugestões de chamadas',
    text: 'Frases prontas para chamar atenção e incentivar o cliente a pedir orçamento.',
  },
]

export default function BonusSection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      aria-labelledby="bonus-title"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconSparkles className="h-3.5 w-3.5" /> Bônus
          </span>
          <h2
            id="bonus-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Bônus para quem contratar{' '}
            <span className="text-gradient-neon">durante o lançamento</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
          {BONUSES.map((b, idx) => (
            <article
              key={b.title}
              className={`group relative overflow-hidden rounded-2xl border border-neon/25 bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon/60 hover:shadow-neon ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Selo */}
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-neon">
                Grátis
              </span>

              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20 group-hover:shadow-neon-sm">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">
                {b.text}
              </p>
            </article>
          ))}
        </div>

        {/* Card CTA bônus */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-neon/40 bg-gradient-to-r from-neon-dark/30 via-bg-card to-neon-dark/30 p-6 text-center sm:flex sm:items-center sm:justify-between sm:p-8 sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-white">
              Garanta todos os bônus agora mesmo
            </h3>
            <p className="mt-1 text-sm text-ink-light">
              Eles acompanham o seu plano, sem custo adicional.
            </p>
          </div>
          <a
            href={buildWhatsappUrl('Quero receber os bônus de lançamento')}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary mt-5 sm:mt-0 sm:shrink-0"
          >
            Quero receber os bônus
            <IconArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
