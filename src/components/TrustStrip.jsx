import {
  IconDevice,
  IconWhatsapp,
  IconLink,
  IconShield,
} from './Icons'

const ITEMS = [
  {
    icon: IconDevice,
    title: 'Pronta para celular',
    desc: 'Layout otimizado para mobile',
  },
  {
    icon: IconWhatsapp,
    title: 'Foco em WhatsApp',
    desc: 'Botões diretos para conversa',
  },
  {
    icon: IconLink,
    title: 'Link para divulgar',
    desc: 'Único, prático e memorável',
  },
  {
    icon: IconShield,
    title: 'Visual profissional',
    desc: 'Mais confiança para o cliente',
  },
]

export default function TrustStrip() {
  return (
    <section
      aria-label="Diferenciais rápidos"
      className="relative border-y border-neon/10 bg-bg-secondary/60 py-7 sm:py-9"
    >
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all duration-300 hover:border-neon/30 hover:bg-neon/5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20 group-hover:shadow-neon-sm">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{title}</p>
                <p className="truncate text-xs text-ink-light">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
