import { IconArrowRight, IconBolt } from './Icons'

export default function TopOfferBar() {
  return (
    <a
      href="#planos"
      className="block border-b border-neon/20 bg-gradient-to-r from-neon-dark/40 via-neon/15 to-neon-dark/40 py-2.5 transition-colors hover:bg-neon/10"
    >
      <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neon">
          <IconBolt className="h-3 w-3" /> Lançamento
        </span>
        <p className="text-xs font-medium text-ink-light sm:text-sm">
          <span className="font-bold text-white">Oferta de lançamento:</span>{' '}
          página profissional com WhatsApp{' '}
          <span className="font-bold text-neon">a partir de R$197</span>
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-neon hover:text-glow-sm">
          Ver planos <IconArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  )
}
