import { useEffect, useMemo, useRef, useState } from 'react'
import { siteConfig, buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import { getPlanBenefits, subscribeToPlanBenefits } from '../lib/supabaseClient'
import useNearViewport from '../hooks/useNearViewport'
import {
  IconArrowRight,
  IconCheckCircle,
  IconCrown,
  IconSparkles,
  IconBolt,
  IconWhatsapp,
} from './Icons'

const DEFAULT_PLANS = [
  {
    key: 'express',
    badge: 'Presença essencial',
    name: siteConfig.planExpress.name,
    price: siteConfig.planExpress.price,
    description: siteConfig.planExpress.description,
    highlight: false,
    microcopy: 'Uma presença digital com a identidade da sua barbearia.',
    items: [
      'Página profissional para barbearia',
      'Botão direto para WhatsApp',
      'Nome, cidade e dados da barbearia',
      'Lista básica de serviços',
      'Visual moderno',
      'Otimizada para celular',
      'Bio personalizada para o Instagram',
      'Suporte técnico inicial',
      '3 revisões incluídas',
    ],
    cta: 'Confirmar o Express',
  },
  {
    key: 'professional',
    badge: 'Página completa',
    name: siteConfig.planProfessional.name,
    price: siteConfig.planProfessional.price,
    description: siteConfig.planProfessional.description,
    highlight: true,
    microcopy: 'Apresente sua barbearia e comece a divulgar.',
    items: [
      'Página profissional completa',
      'Apresentação da barbearia',
      'Seção de serviços',
      'Seção de diferenciais',
      'Copy persuasiva',
      'Botões estratégicos de WhatsApp',
      'Design premium',
      'Otimizada para celular',
      'Bio personalizada para o Instagram',
      '4 arquivos finais de criativos, incluindo adaptações',
      'Artes para Meta Ads, WhatsApp e Instagram',
      'Suporte técnico',
      '3 revisões incluídas',
      'Suporte comercial guiado por 30 dias',
      'Orientação passo a passo para divulgação',
    ],
    cta: 'Confirmar o Profissional',
  },
  {
    key: 'turbo',
    badge: 'Mais criativos',
    name: siteConfig.planTurbo.name,
    price: siteConfig.planTurbo.price,
    description: siteConfig.planTurbo.description,
    highlight: false,
    microcopy: 'Mais opções de artes para divulgar sua barbearia.',
    items: [
      'Tudo do plano Profissional',
      'Bio personalizada para o Instagram',
      'Página com estrutura mais persuasiva',
      'Copy de venda aprimorada',
      '10 arquivos finais de criativos no total, incluindo adaptações',
      'Texto principal para Facebook/Instagram Ads',
      'Título e descrição para anúncio',
      'Direcionamento inicial para campanha',
      'Estrutura premium para tráfego pago',
      'Suporte técnico',
      '3 revisões incluídas',
      'Suporte comercial guiado por 30 dias',
      'Acompanhamento passo a passo',
    ],
    cta: 'Confirmar o Turbo',
  },
]

function PlanCard({ plan, popular }) {
  return (
    <article
      data-reveal-item
      className={`relative flex flex-col rounded-3xl bg-bg-card p-6 transition-transform duration-300 sm:p-7 ${
        popular
          ? 'card-animated-strong z-10 scale-[1.01] lg:scale-[1.025]'
          : 'card-animated-subtle hover:-translate-y-0.5'
      }`}
    >
      {/* Badge topo */}
      <div className="flex items-center justify-between">
        <span
          className={`badge-neon ${
            popular ? 'bg-neon/20 border-neon text-neon text-glow-sm' : ''
          }`}
        >
          {popular ? (
            <IconCrown className="h-3.5 w-3.5" />
          ) : plan.key === 'turbo' ? (
            <IconBolt className="h-3.5 w-3.5" />
          ) : (
            <IconSparkles className="h-3.5 w-3.5" />
          )}
          {plan.badge}
        </span>
        {popular && (
          <span className="hidden rounded-full bg-neon px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-bg-primary sm:inline-block">
            Destaque
          </span>
        )}
      </div>

      {/* Nome + descrição */}
      <h3 className="mt-5 text-xl font-extrabold text-white">{plan.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-light">
        {plan.description}
      </p>

      {/* Preço */}
      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-extrabold leading-none text-white sm:text-5xl">
          {plan.price}
        </span>
        <span className="pb-1.5 text-sm text-ink-light">à vista</span>
      </div>

      {/* Items */}
      {plan.items === null ? (
        <div className="mt-6 space-y-2.5" aria-label={`Carregando benefícios do ${plan.name}`} aria-busy="true">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-2.5" aria-hidden="true">
              <span className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-neon/10" />
              <span
                className="h-3 animate-pulse rounded-full bg-white/10"
                style={{ width: `${76 - index * 5}%` }}
              />
            </div>
          ))}
        </div>
      ) : plan.items.length > 0 ? (
      <ul className="mt-6 space-y-2.5" aria-label={`Benefícios incluídos no ${plan.name}`}>
        {plan.items.map(item => {
          const itemText = typeof item === 'string' ? item : item.benefit_text
          const itemKey = typeof item === 'string' ? item : item.id
          return (
          <li
            key={itemKey}
            className="flex items-start gap-2.5 text-sm text-ink-light"
          >
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                popular
                  ? 'bg-neon/25 text-neon'
                  : 'bg-neon/10 text-neon'
              }`}
            >
              <IconCheckCircle className="h-3.5 w-3.5" />
            </span>
            {itemText}
          </li>
          )
        })}
      </ul>
      ) : (
        <p className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-relaxed text-ink-light">
          Consulte os benefícios atuais deste plano pelo WhatsApp.
        </p>
      )}

      {/* CTA */}
      <div className="mt-7 pt-2">
        <a
          href={buildWhatsappUrl(whatsappMessages.plan(plan.name, plan.price))}
          data-analytics-event="plan_click"
          data-plan-name={plan.name}
          data-cta-location="pricing"
          target="_blank"
          rel="noreferrer noopener"
          className={popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
        >
          {popular && <IconWhatsapp className="h-5 w-5" />}
          {plan.cta}
          {!popular && <IconArrowRight className="h-4 w-4" />}
        </a>
        <p className="mt-3 text-center text-xs text-ink-light">
          {plan.microcopy}
        </p>
      </div>
    </article>
  )
}

export default function PricingSection() {
  const [liveBenefits, setLiveBenefits] = useState(null)
  const [benefitsFailed, setBenefitsFailed] = useState(false)
  const [liveRevision, setLiveRevision] = useState(0)
  const requestSequence = useRef(0)
  const [sectionRef, shouldLoad] = useNearViewport('900px 0px')

  useEffect(() => {
    if (!shouldLoad) return undefined
    let active = true
    let debounceTimer

    async function refreshBenefits({ announce = false } = {}) {
      const requestId = ++requestSequence.current
      try {
        const rows = await getPlanBenefits()
        if (!active || requestId !== requestSequence.current) return
        setLiveBenefits(Array.isArray(rows) ? rows : [])
        setBenefitsFailed(false)
        if (announce) setLiveRevision(current => current + 1)
      } catch {
        if (active) setBenefitsFailed(true)
      }
    }

    function queueRealtimeRefresh() {
      window.clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(
        () => refreshBenefits({ announce: true }),
        80,
      )
    }

    function refreshWhenVisible() {
      if (document.visibilityState === 'visible') refreshBenefits()
    }

    refreshBenefits()
    const unsubscribe = subscribeToPlanBenefits(queueRealtimeRefresh)
    const pollingTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshBenefits()
    }, 30_000)
    window.addEventListener('focus', refreshBenefits)
    window.addEventListener('online', refreshBenefits)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      active = false
      window.clearTimeout(debounceTimer)
      window.clearInterval(pollingTimer)
      window.removeEventListener('focus', refreshBenefits)
      window.removeEventListener('online', refreshBenefits)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      unsubscribe()
    }
  }, [shouldLoad])

  const plans = useMemo(() => {
    if (liveBenefits === null) {
      if (benefitsFailed) return DEFAULT_PLANS
      return DEFAULT_PLANS.map(plan => ({ ...plan, items: null }))
    }

    return DEFAULT_PLANS.map(plan => ({
      ...plan,
      items: liveBenefits.filter(benefit => benefit.plan_key === plan.key),
    }))
  }, [benefitsFailed, liveBenefits])

  return (
    <section
      ref={sectionRef}
      id="planos"
      className="relative py-20 sm:py-28"
      aria-labelledby="pricing-title"
    >
      {/* Glow de fundo — mais discreto */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 hidden h-1/2 w-[65%] -translate-x-1/2 bg-radial-green opacity-12 sm:block"
      />

      <div className="container-page relative">
        <span className="sr-only" aria-live="polite">
          {liveRevision > 0 ? `Benefícios dos planos atualizados. Atualização ${liveRevision}.` : ''}
        </span>
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconSparkles className="h-3.5 w-3.5" /> Planos
          </span>
          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Sua barbearia. Seu momento.{' '}
            <span className="text-gradient-neon">Seu plano.</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Página e bio personalizada nos três planos. Criativos no
            Profissional e Turbo. Confirme tudo pelo WhatsApp antes de iniciar. A entrega
            acontece de 3 a 5 dias após a confirmação do pagamento.
          </p>
        </div>

        <div data-reveal-group className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 lg:grid-cols-3 lg:gap-7">
          {plans.map(p => (
            <PlanCard
              key={p.key}
              plan={p}
              popular={p.key === 'professional'}
            />
          ))}
        </div>

        <p data-reveal className="mt-10 text-center text-xs text-ink-light">
          * Os valores acima valem para os itens descritos em cada plano. Se
          você precisar de algo fora desse escopo, a opção é apresentada e
          aprovada antes de qualquer alteração.
        </p>
      </div>
    </section>
  )
}
