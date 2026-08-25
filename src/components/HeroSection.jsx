import { useEffect, useRef, useState } from 'react'
import { siteConfig, buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import {
  IconArrowRight,
  IconBolt,
  IconCheckCircle,
  IconWhatsapp,
  IconDevice,
} from './Icons'

/* ----------------------------------
   Mockup CSS - celular com a página
-----------------------------------*/
function MockupPhone() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-[260px] max-w-full sm:w-[290px]">
      {/* Moldura do celular */}
      <div className="relative rounded-[2.4rem] border-2 border-neon/30 bg-bg-primary p-2.5">
        <div className="rounded-[1.9rem] border border-white/10 bg-bg-secondary">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-ink-light">
            <span>9:41</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neon" />
              4G
            </span>
          </div>

          {/* Conteúdo da página (preview) */}
          <div className="space-y-3 px-4 pb-6 pt-4">
            {/* Capa com nome do negócio */}
            <div className="overflow-hidden rounded-xl border border-neon/20 bg-gradient-to-br from-neon-dark/50 via-bg-card to-bg-card">
              <div className="relative h-20 w-full bg-gradient-to-r from-neon/20 via-neon-secondary/10 to-transparent">
                <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30" />
                <div className="absolute bottom-2 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neon/40 bg-neon/15 text-[10px] font-extrabold text-neon">
                  ZP
                </div>
              </div>
              <div className="px-3 pb-3 pt-2">
                <p className="text-[11px] font-bold text-white">
                  Barbearia Premium
                </p>
                <p className="text-[9px] text-ink-light">
                  Cortes modernos · Atendimento agora
                </p>
                <p className="mt-2 text-[9px] font-semibold text-neon">
                  Informações claras em um só link
                </p>
              </div>
            </div>

            {/* Serviços */}
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-light">
                Serviços
              </p>
              <div className="space-y-1.5">
                {['Corte masculino', 'Barba', 'Sobrancelha'].map(s => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-bg-card px-2.5 py-2"
                  >
                    <span className="text-[10px] text-white">{s}</span>
                    <span className="rounded bg-neon/15 px-1.5 py-0.5 text-[9px] font-bold text-neon">
                      ver
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diferenciais */}
            <div className="grid grid-cols-2 gap-1.5">
              {['Atende hoje', 'Pix e cartão'].map(f => (
                <div
                  key={f}
                  className="flex items-center gap-1 rounded-md bg-neon/10 px-2 py-1.5"
                >
                  <IconCheckCircle className="h-2.5 w-2.5 text-neon" />
                  <span className="text-[9px] text-white">{f}</span>
                </div>
              ))}
            </div>

            {/* Informação de contato */}
            <div className="flex items-center gap-2 rounded-lg border border-neon/20 bg-bg-card px-3 py-2">
              <p className="text-[9px] text-ink-light">
                <span className="font-bold text-white">Botão de WhatsApp</span>{' '}
                pronto para conversar
              </p>
            </div>

            {/* CTA WhatsApp */}
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-neon py-3 text-[11px] font-extrabold text-bg-primary">
              <IconWhatsapp className="h-4 w-4" />
              Chamar no WhatsApp
            </div>

            <p className="text-center text-[8px] text-ink-dark">
              Atend. imediato · Resposta rápida
            </p>
          </div>

          {/* Home indicator */}
          <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------
   Mockup CSS - notebook ao fundo
-----------------------------------*/
function MockupLaptop() {
  return (
    <div aria-hidden="true" className="relative hidden md:block">
      <div className="rounded-2xl border-2 border-neon/30 bg-bg-primary p-3">
        <div className="overflow-hidden rounded-md border border-white/10 bg-bg-secondary">
          {/* Top bar navegador */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-bg-card px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
            <span className="h-2 w-2 rounded-full bg-neon/80" />
            <div className="ml-2 h-4 flex-1 rounded bg-bg-primary text-center text-[9px] leading-4 text-ink-light">
              zappage.com/seu-negocio
            </div>
          </div>
          {/* Conteúdo */}
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="space-y-2">
              <div className="h-16 rounded bg-gradient-to-br from-neon/30 to-transparent" />
              <div className="h-3 w-3/4 rounded bg-neon/40" />
              <div className="h-2 w-2/3 rounded bg-white/15" />
              <div className="flex gap-1">
                <div className="h-2 w-12 rounded bg-neon/30" />
                <div className="h-2 w-10 rounded bg-white/15" />
              </div>
            </div>
            <div className="space-y-1.5">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5"
                >
                  <div className="h-2 w-12 rounded bg-white/15" />
                  <div className="h-2 w-5 rounded bg-neon/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Base do notebook */}
      <div className="mx-auto h-2.5 w-[102%] -translate-x-[1%] rounded-b-2xl bg-gradient-to-b from-neon/30 to-bg-primary" />
    </div>
  )
}

function HeroMockupFallback() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute left-0 top-12 w-[88%] -rotate-2 sm:left-4 sm:w-[80%] lg:left-0 lg:w-[82%]">
        <MockupLaptop />
      </div>

      <div className="relative ml-auto w-[240px] animate-float sm:w-[280px] lg:w-[320px]">
        <MockupPhone />
      </div>

      <div className="absolute left-2 top-2 hidden rounded-xl border border-white/15 bg-bg-card/90 p-3 backdrop-blur-xl sm:block lg:left-4 lg:top-4">
        <p className="text-[10px] font-semibold text-white">Oferta mais clara</p>
        <p className="mt-1 text-[9px] text-ink-light">Menos dúvidas no atendimento</p>
      </div>

      <div className="absolute -right-2 bottom-4 hidden rounded-xl border border-white/15 bg-bg-card/90 px-3 py-2 backdrop-blur-xl sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neon text-bg-primary">
            <IconWhatsapp className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold text-white">WhatsApp</p>
            <p className="text-[9px] text-ink-light">Resposta rápida</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaybackIcon({ playing }) {
  if (playing) {
    return (
      <span aria-hidden="true" className="inline-flex gap-1">
        <span className="h-3 w-0.5 rounded-full bg-current" />
        <span className="h-3 w-0.5 rounded-full bg-current" />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current"
    />
  )
}

function HeroVideo() {
  const videoRef = useRef(null)
  const layerRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoSource, setVideoSource] = useState('')
  const [motionAllowed, setMotionAllowed] = useState(() =>
    typeof window === 'undefined'
      ? true
      : !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPlaybackPreference = () => {
      const allowed = !preference.matches
      const video = videoRef.current
      setMotionAllowed(allowed)

      if (!video) return
      if (!allowed) {
        video.pause()
      } else if (video.readyState >= 2) {
        video.play().catch(() => setIsPlaying(false))
      }
    }

    syncPlaybackPreference()
    if (preference.addEventListener) {
      preference.addEventListener('change', syncPlaybackPreference)
    } else {
      preference.addListener?.(syncPlaybackPreference)
    }

    return () => {
      if (preference.removeEventListener) {
        preference.removeEventListener('change', syncPlaybackPreference)
      } else {
        preference.removeListener?.(syncPlaybackPreference)
      }
    }
  }, [])

  useEffect(() => {
    if (!motionAllowed) {
      setVideoSource('')
      setVideoReady(false)
      setIsPlaying(false)
      return undefined
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) {
      return undefined
    }

    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const timer = window.setTimeout(
      () => setVideoSource(isMobile ? '/videos/hero-mobile-v2.mp4' : '/videos/hero-desktop-v2.mp4'),
      isMobile ? 900 : 450,
    )
    return () => window.clearTimeout(timer)
  }, [motionAllowed])

  useEffect(() => {
    const video = videoRef.current
    const hero = layerRef.current?.closest('section')
    if (!video || !hero || !videoSource || !('IntersectionObserver' in window)) return undefined

    let heroVisible = true
    const syncVisibility = () => {
      if (!motionAllowed || document.visibilityState === 'hidden' || !heroVisible) {
        video.pause()
        return
      }
      if (video.readyState >= 2) video.play().catch(() => setIsPlaying(false))
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting
        syncVisibility()
      },
      { threshold: 0.08 },
    )

    observer.observe(hero)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [motionAllowed, videoSource])

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return undefined

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactViewport = window.matchMedia('(max-width: 640px)')
    let frame = 0

    const updateParallax = () => {
      frame = 0

      if (preference.matches || compactViewport.matches) {
        layer.style.transform = 'translate3d(0, 0, 0) scale(1.08)'
        return
      }

      const hero = layer.closest('section')
      if (!hero) return

      const heroHeight = Math.max(1, hero.offsetHeight)
      const travelled = Math.min(heroHeight, Math.max(0, -hero.getBoundingClientRect().top))
      const progress = travelled / heroHeight
      const offset = travelled * 0.11
      const scale = 1.08 + progress * 0.035

      layer.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`
    }

    const requestUpdate = () => {
      if (preference.matches || compactViewport.matches) return
      if (frame) return
      frame = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })
    if (preference.addEventListener) {
      preference.addEventListener('change', requestUpdate)
      compactViewport.addEventListener('change', updateParallax)
    } else {
      preference.addListener?.(requestUpdate)
      compactViewport.addListener?.(updateParallax)
    }

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (preference.removeEventListener) {
        preference.removeEventListener('change', requestUpdate)
        compactViewport.removeEventListener('change', updateParallax)
      } else {
        preference.removeListener?.(requestUpdate)
        compactViewport.removeListener?.(updateParallax)
      }
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const handleVideoReady = () => {
    setVideoReady(true)
  }

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => setIsPlaying(false))
    } else {
      video.pause()
    }
  }

  if (videoFailed) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-bg-primary">
      <div
        ref={layerRef}
        aria-hidden="true"
        className="absolute -inset-[10%] will-change-auto sm:will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.08)' }}
      >
          {videoSource && <video
            id="hero-background-video"
            ref={videoRef}
            src={videoSource}
            aria-hidden="true"
            tabIndex={-1}
            autoPlay={motionAllowed}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            onCanPlay={handleVideoReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoFailed(true)}
            className={`h-full w-full object-cover object-center transition-opacity duration-700 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,2,0.96)_0%,rgba(2,4,2,0.86)_50%,rgba(2,4,2,0.58)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-transparent to-bg-primary/90"
      />

      {videoReady && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-controls="hero-background-video"
          aria-label={isPlaying ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
          className="pointer-events-auto absolute bottom-4 right-4 z-20 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-bg-primary/80 px-3 text-xs font-bold text-white backdrop-blur-xl transition-colors hover:border-neon/40 hover:bg-bg-primary sm:bottom-6 sm:right-6"
        >
          <PlaybackIcon playing={isPlaying} />
          <span className="hidden sm:inline">{isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}</span>
        </button>
      )}
    </div>
  )
}

/* ----------------------------------
   HERO SECTION
-----------------------------------*/
export default function HeroSection() {
  return (
    <section
      className="relative isolate min-h-[calc(100svh-6rem)] overflow-hidden bg-futuristic-dense"
    >
      <HeroVideo />

      {/* Radial glow superior — mais discreto */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[55%] w-[75%] -translate-x-1/2 bg-radial-green opacity-22"
      />

      <div className="container-page relative z-10">
        <div className="flex min-h-[calc(100svh-6rem)] items-center py-14 pb-24 sm:py-16 sm:pb-24 lg:min-h-[720px] lg:py-24 lg:pb-28">
          {/* Texto */}
          <div className="relative z-10 max-w-3xl animate-fade-up">
            <div className="mb-5 flex items-center gap-4">
              <img
                src={siteConfig.logoSrc}
                alt={`${siteConfig.brandName} logo`}
                width={256}
                height={256}
                decoding="async"
                fetchpriority="high"
                className="h-20 w-20 rounded-2xl border border-white/15 bg-bg-primary object-cover sm:h-24 sm:w-24"
              />
              <div className="min-w-0">
                <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {siteConfig.brandName}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neon sm:text-sm">
                  Páginas que vendem. Conversas que convertem.
                </p>
              </div>
            </div>

            <span className="badge-neon mb-5">
              <IconDevice className="h-3.5 w-3.5" />
              Para negócios locais que vendem pelo WhatsApp
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
              Transforme seu WhatsApp em uma{' '}
              <span className="text-gradient-neon text-glow">
                vitrine profissional que gera pedidos.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-light">
              Criamos uma página rápida e feita para celular que apresenta seu
              negócio, explica seus serviços e leva o cliente{' '}
              <strong className="font-semibold text-white">
                para uma conversa de compra no WhatsApp
              </strong>
              .
            </p>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-light/90">
              Você divulga um único link. O cliente entende sua oferta, ganha
              confiança e chama você com um clique.
            </p>

            {/* Bullets */}
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {[
                'Estrutura profissional pronta para divulgar',
                'Botões diretos para o WhatsApp do seu negócio',
                'Oferta e diferenciais explicados com clareza',
                'Ideal para Instagram, anúncios e link da bio',
                'Planos a partir de R$197',
                'Você confirma o plano antes de iniciar',
              ].map(b => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-ink-light"
                >
                  <IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsappUrl(whatsappMessages.recommendation)}
                target="_blank"
                rel="noreferrer noopener"
                data-cta-location="hero"
                className="btn-primary"
              >
                Quero meu plano recomendado
                <IconWhatsapp className="h-5 w-5" />
              </a>
              <a href="#planos" data-cta-location="hero-plans" className="btn-secondary">
                Ver planos e preços
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 text-xs text-ink-dark">
              <IconBolt className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-neon" />
              No WhatsApp, você confirma o plano ideal e os próximos passos
              antes de iniciar.
            </p>
          </div>

        </div>
      </div>

      {/* Divisor inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
    </section>
  )
}
