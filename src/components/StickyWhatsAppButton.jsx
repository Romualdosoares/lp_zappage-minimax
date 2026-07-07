import { useState, useEffect } from 'react'
import { buildWhatsappUrl } from '../siteConfig'
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
    <div className="fixed bottom-5 right-4 z-50 flex items-end gap-2 sm:bottom-6 sm:right-6">
      {/* Label desktop que some */}
      {showLabel && (
        <button
          type="button"
          onClick={() => setShowLabel(false)}
          className="hidden animate-fade-up items-center gap-2 rounded-full border border-neon/40 bg-bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-neon-sm backdrop-blur-xl transition-opacity hover:bg-bg-primary sm:flex"
          aria-label="Fechar lembrete de WhatsApp"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon" />
          Fale com a gente
          <span className="text-ink-light hover:text-white">
            <IconClose className="h-4 w-4" />
          </span>
        </button>
      )}

      {/* Botão flutuante */}
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Abrir conversa no WhatsApp"
        className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-neon px-4 py-3 text-bg-primary shadow-neon-strong transition-all duration-300 hover:-translate-y-0.5 hover:shadow-neon sm:px-5 sm:py-3.5"
      >
        {/* Pulse halo */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 animate-ping rounded-full bg-neon/40 opacity-60"
        />
        <IconWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="hidden text-sm font-extrabold sm:inline">
          Falar no WhatsApp
        </span>
        {/* Mobile: ícone + wordmark */}
        <span className="text-[11px] font-extrabold uppercase tracking-wide sm:hidden">
          WhatsApp
        </span>
      </a>
    </div>
  )
}
