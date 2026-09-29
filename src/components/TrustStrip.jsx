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
        <ul data-reveal-group className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-4 sm:gap-6">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              data-reveal-item
              className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-neon/30 hover:bg-neon/5 sm:items-center sm:p-2"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon/20">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-white">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-ink-light">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
