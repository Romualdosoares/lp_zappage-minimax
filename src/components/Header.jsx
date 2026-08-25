import { useEffect, useRef, useState } from 'react'
import { siteConfig, buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import { IconMenu, IconClose, IconBolt } from './Icons'

const NAV = [
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Demonstrações', href: '#portfolio' },
  { label: 'Quem somos', href: '#quem-somos' },
  { label: 'Planos', href: '#planos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Dúvidas', href: '#faq' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const menuButtonRef = useRef(null)

  const closeMobileMenu = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
  }

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 16
      setScrolled(current => (current === next ? current : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const sections = NAV.map(item => document.querySelector(item.href)).filter(Boolean)
    const observer = new IntersectionObserver(
      entries => {
        const current = entries.find(entry => entry.isIntersecting)
        if (current) setActiveHref(`#${current.target.id}`)
      },
      { rootMargin: '-28% 0px -62% 0px', threshold: 0 },
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = event => {
      if (event.key !== 'Escape') return
      closeMobileMenu(true)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

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
          <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-neon/25 bg-bg-primary shadow-neon-sm transition-transform duration-300 group-hover:scale-105">
            <img
              src={siteConfig.logoSrc}
              alt={`${siteConfig.brandName} logo`}
              width={256}
              height={256}
              decoding="async"
              fetchpriority="high"
              className="h-full w-full object-cover"
            />
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
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/[0.035] hover:text-white ${
                activeHref === item.href
                  ? 'bg-white/[0.035] text-white after:absolute after:inset-x-4 after:-bottom-0.5 after:h-px after:bg-neon'
                  : 'text-ink-light'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center gap-3 xl:flex">
          <a
            href={buildWhatsappUrl(whatsappMessages.recommendation)}
            target="_blank"
            rel="noreferrer noopener"
            data-cta-location="header"
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Receber recomendação
            <IconBolt className="h-4 w-4" />
          </a>
        </div>

        {/* Toggle mobile */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-neon/30 text-neon xl:hidden"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={`max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain xl:hidden ${open ? 'block' : 'hidden'} border-t border-neon/15 bg-bg-primary/95 backdrop-blur-xl`}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => closeMobileMenu(true)}
              aria-current={activeHref === item.href ? 'location' : undefined}
              className={`rounded-lg border-l-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.035] hover:text-white ${
                activeHref === item.href
                  ? 'border-neon bg-white/[0.035] text-white'
                  : 'border-transparent text-ink-light'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={buildWhatsappUrl(whatsappMessages.recommendation)}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => closeMobileMenu(true)}
            data-cta-location="mobile-menu"
            className="btn-primary mt-3 justify-center"
          >
            Receber recomendação
            <IconBolt className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
