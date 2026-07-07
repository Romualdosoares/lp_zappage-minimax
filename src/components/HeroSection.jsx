import { siteConfig, buildWhatsappUrl } from '../siteConfig'
import {
  IconArrowRight,
  IconBolt,
  IconCheckCircle,
  IconWhatsapp,
  IconStar,
  IconDevice,
} from './Icons'

/* ----------------------------------
   Mockup CSS - celular com a página
-----------------------------------*/
function MockupPhone() {
  return (
    <div className="relative mx-auto w-[260px] max-w-full sm:w-[290px]">
      {/* Glow atrás */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-neon/25 blur-3xl"
      />

      {/* Moldura do celular */}
      <div className="relative rounded-[2.4rem] border-2 border-neon/40 bg-bg-primary p-2.5 shadow-neon">
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
                  VZ
                </div>
              </div>
              <div className="px-3 pb-3 pt-2">
                <p className="text-[11px] font-bold text-white">
                  Barbearia Premium
                </p>
                <p className="text-[9px] text-ink-light">
                  Cortes modernos · Atendimento agora
                </p>
                <div className="mt-2 flex items-center gap-1 text-[9px] text-neon">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} className="h-2.5 w-2.5" />
                  ))}
                  <span className="ml-1 text-ink-light">4.9 · 280+</span>
                </div>
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

            {/* Avaliação */}
            <div className="flex items-center gap-2 rounded-lg border border-neon/20 bg-bg-card px-3 py-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <IconStar key={i} className="h-2.5 w-2.5 text-neon" />
                ))}
              </div>
              <p className="text-[9px] text-ink-light">
                <span className="font-bold text-white">+280 clientes</span>{' '}
                avaliaram
              </p>
            </div>

            {/* CTA WhatsApp */}
            <a
              href={buildWhatsappUrl('Quero agendar')}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-neon py-3 text-[11px] font-extrabold text-bg-primary shadow-neon-sm animate-pulse-glow"
            >
              <IconWhatsapp className="h-4 w-4" />
              Chamar no WhatsApp
            </a>

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
    <div className="relative hidden md:block">
      <div className="rounded-2xl border-2 border-neon/30 bg-bg-primary p-3 shadow-neon">
        <div className="overflow-hidden rounded-md border border-white/10 bg-bg-secondary">
          {/* Top bar navegador */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-bg-card px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
            <span className="h-2 w-2 rounded-full bg-neon/80" />
            <div className="ml-2 h-4 flex-1 rounded bg-bg-primary text-center text-[9px] leading-4 text-ink-light">
              vendezap.com/seu-negocio
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

/* ----------------------------------
   HERO SECTION
-----------------------------------*/
export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-futuristic-dense pt-10 sm:pt-16 lg:pt-24"
    >
      {/* Radial glow superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[60%] w-[80%] -translate-x-1/2 bg-radial-green opacity-80"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Texto */}
          <div className="relative z-10 animate-fade-up">
            <span className="badge-neon mb-5">
              <IconDevice className="h-3.5 w-3.5" />
              Para negócios locais que vendem pelo WhatsApp
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
              Pare de perder clientes por{' '}
              <span className="text-gradient-neon text-glow">
                não ter uma página profissional.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-light">
              Criamos uma página bonita, rápida e otimizada para celular para
              apresentar seu negócio, mostrar seus serviços e levar o cliente{' '}
              <strong className="font-semibold text-white">
                direto para uma conversa no WhatsApp
              </strong>
              .
            </p>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-light/90">
              Você divulga um único link. O cliente acessa, entende o que você
              oferece e chama você com um clique.
            </p>

            {/* Bullets */}
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {[
                'Página profissional pronta para divulgar',
                'Botão direto para o WhatsApp do seu negócio',
                'Visual moderno para passar mais confiança',
                'Ideal para Instagram, anúncios e cartão digital',
                'Planos a partir de R$197',
                'Suporte guiado nos planos principais',
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
                href={buildWhatsappUrl('Quero minha página profissional')}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary animate-pulse-glow"
              >
                Quero minha página profissional
                <IconWhatsapp className="h-5 w-5" />
              </a>
              <a href="#planos" className="btn-secondary">
                Ver planos e preços
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 text-xs text-ink-dark">
              <IconBolt className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-neon" />
              Sem complicação. Você envia as informações e nós montamos a
              estrutura.
            </p>
          </div>

          {/* Mockup */}
          <div className="relative animate-fade-up delay-200">
            {/* Notebook ao fundo */}
            <div className="absolute left-0 top-12 w-[88%] -rotate-2 sm:left-4 sm:w-[80%] lg:left-0 lg:w-[82%]">
              <MockupLaptop />
            </div>

            {/* Celular em destaque */}
            <div className="relative ml-auto w-[240px] sm:w-[280px] lg:w-[320px] animate-float">
              <MockupPhone />
            </div>

            {/* Card flutuante de avaliação */}
            <div className="absolute left-2 top-2 hidden rounded-xl border border-neon/30 bg-bg-card/90 p-3 shadow-neon-sm backdrop-blur-xl sm:block lg:left-4 lg:top-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} className="h-3 w-3 text-neon" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white">4.9</span>
              </div>
              <p className="mt-1 text-[10px] font-semibold text-white">
                +280 avaliações
              </p>
              <p className="text-[9px] text-ink-light">Clientes satisfeitos</p>
            </div>

            {/* Card flutuante WhatsApp */}
            <div className="absolute -right-2 bottom-4 hidden rounded-xl border border-neon/40 bg-bg-card/90 px-3 py-2 shadow-neon-sm backdrop-blur-xl sm:block">
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
        </div>
      </div>

      {/* Divisor inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
    </section>
  )
}
