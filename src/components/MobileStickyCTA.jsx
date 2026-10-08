import usePlanPrices from '../hooks/usePlanPrices.js'
import { buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import { IconWhatsapp } from './Icons'

export default function MobileStickyCTA() {
  const prices = usePlanPrices()
  return (
    <div
      className="mobile-sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-neon/20 bg-bg-primary/95 px-3 py-2 backdrop-blur-xl transition-[transform,opacity] duration-300 sm:hidden"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neon">
            Feito para barbearias
          </p>
          <p className="text-sm font-extrabold text-white">
            Página + bio desde <span className="text-neon">{prices.express.price}</span>
          </p>
        </div>
        <a
          href={buildWhatsappUrl(whatsappMessages.recommendation)}
          target="_blank"
          rel="noreferrer noopener"
          data-cta-location="mobile-sticky"
          className="btn-primary ml-auto px-4 py-2.5 text-sm"
        >
          <IconWhatsapp className="h-4 w-4" />
          Criar página
        </a>
      </div>
    </div>
  )
}
