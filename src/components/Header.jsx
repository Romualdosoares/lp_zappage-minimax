import { useState, useEffect } from 'react'
import { siteConfig, buildWhatsappUrl } from '../siteConfig'
import { IconMenu, IconClose, IconBolt, IconWhatsapp } from './Icons'

const NAV = [
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Planos', href: '#planos' },
  { label: 'Dúvidas', href: '#faq' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-neon/15 bg-bg-primary/85 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neon shadow-neon-sm transition-transform duration-300 group-hover:scale-105">
            <IconWhatsapp className="h-5 w-5 text-bg-primary" />
            <span className="absolute -inset-1 -z-10 rounded-xl bg-neon/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              {siteConfig.brandName}
            </span>
            <span className="hidden text-[11px] font-medium text-ink-light sm:block">
              Página <span className="text-neon">+</span> WhatsApp{' '}
              <span className="text-neon">+</span> Conversão
            </span>
          </div>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-light transition-colors hover:bg-neon/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={buildWhatsappUrl('Quero começar agora')}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Começar agora
            <IconBolt className="h-4 w-4" />
          </a>
        </div>

        {/* Toggle mobile */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neon/30 text-neon lg:hidden"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`lg:hidden ${open ? 'block' : 'hidden'} border-t border-neon/15 bg-bg-primary/95 backdrop-blur-xl`}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-light transition-colors hover:bg-neon/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href={buildWhatsappUrl('Quero começar agora')}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 justify-center"
          >
            Começar agora
            <IconBolt className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
