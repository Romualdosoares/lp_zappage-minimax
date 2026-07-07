import { buildWhatsappUrl } from '../siteConfig'
import { IconWhatsapp } from './Icons'

export default function MobileStickyCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neon/30 bg-bg-primary/95 px-3 py-2 backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neon">
            Oferta de lançamento
          </p>
          <p className="text-sm font-extrabold text-white">
            Página a partir de <span className="text-neon">R$197</span>
          </p>
        </div>
        <a
          href={buildWhatsappUrl('Quero começar agora (mobile)')}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-primary ml-auto animate-pulse-glow px-4 py-2.5 text-sm"
        >
          <IconWhatsapp className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
