import { useState, useEffect } from 'react'
import { buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import { IconWhatsapp, IconClose } from './Icons'

export default function StickyWhatsAppButton() {
  const [hidden, setHidden] = useState(false)
  const [showLabel, setShowLabel] = useState(true)

  useEffect(() => {
    // Esconde a label depois de alguns segundos
    const t = setTimeout(() => setShowLabel(false), 6000)
    return () => clearTimeout(t)
  }, [])

  if (hidden) return null

  return (
    <div className="fixed bottom-5 right-4 z-50 hidden items-end gap-2 sm:bottom-6 sm:right-6 sm:flex">
      {/* Label desktop que some */}
      {showLabel && (
        <button
          type="button"
          onClick={() => setShowLabel(false)}
          className="hidden animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-bg-primary/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition-opacity hover:bg-bg-primary sm:flex"
          aria-label="Fechar lembrete de WhatsApp"
        >
          <span className="h-2 w-2 rounded-full bg-neon" />
          Página para sua barbearia
          <span className="text-ink-light hover:text-white">
            <IconClose className="h-4 w-4" />
          </span>
        </button>
      )}

      {/* Botão flutuante */}
      <a
        href={buildWhatsappUrl(whatsappMessages.general)}
        target="_blank"
        rel="noreferrer noopener"
        data-cta-location="desktop-sticky"
        aria-label="Abrir conversa no WhatsApp"
        className="btn-primary group relative inline-flex items-center justify-center gap-2 !rounded-full px-4 py-3 sm:px-5 sm:py-3.5"
      >
        <IconWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="hidden text-sm font-extrabold sm:inline">
          Criar minha página
        </span>
        {/* Mobile: ícone + wordmark */}
        <span className="text-[11px] font-extrabold uppercase tracking-wide sm:hidden">
          WhatsApp
        </span>
      </a>
    </div>
  )
}
