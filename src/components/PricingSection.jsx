import { siteConfig, buildWhatsappUrl, whatsappMessages } from '../siteConfig'
import {
  IconArrowRight,
  IconCheckCircle,
  IconCrown,
  IconSparkles,
  IconBolt,
  IconWhatsapp,
} from './Icons'

const PLANS = [
  {
    key: 'express',
    badge: 'Entrada rápida',
    name: siteConfig.planExpress.name,
    price: siteConfig.planExpress.price,
    description: siteConfig.planExpress.description,
    highlight: false,
    microcopy: 'Para validar sua presença digital com uma estrutura essencial.',
    items: [
      'Página profissional simples',
      'Botão direto para WhatsApp',
      'Nome, cidade e dados do negócio',
      'Lista básica de serviços',
      'Visual moderno',
      'Otimizada para celular',
      'Link pronto para divulgar',
      'Suporte técnico inicial',
      '3 revisões incluídas',
    ],
    cta: 'Confirmar o Express',
  },
  {
    key: 'professional',
    badge: 'Mais vendido',
    name: siteConfig.planProfessional.name,
    price: siteConfig.planProfessional.price,
    description: siteConfig.planProfessional.description,
    highlight: true,
    microcopy: 'A escolha mais completa para a maioria dos negócios locais.',
    items: [
      'Página profissional completa',
      'Apresentação do negócio',
      'Seção de serviços',
      'Seção de diferenciais',
      'Copy persuasiva',
      'Botões estratégicos de WhatsApp',
      'Design premium',
      'Otimizada para celular',
      'Link pronto para Instagram e anúncios',
      'Suporte técnico',
      '3 revisões incluídas',
      'Suporte comercial guiado por 30 dias',
      'Orientação passo a passo para divulgação',
    ],
    cta: 'Confirmar o Profissional',
  },
  {
    key: 'turbo',
    badge: 'Melhor para anunciar',
    name: siteConfig.planTurbo.name,
    price: siteConfig.planTurbo.price,
    description: siteConfig.planTurbo.description,
    highlight: false,
    microcopy: 'Para quem quer uma página preparada para divulgar em campanhas.',
    items: [
      'Tudo do plano Profissional',
      'Página com estrutura mais persuasiva',
      'Copy de venda aprimorada',
      '3 criativos para anúncio',
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
      className={`relative flex flex-col rounded-3xl border bg-bg-card p-6 transition-all duration-300 sm:p-7 ${
        popular
          ? 'z-10 scale-[1.02] border-neon/70 shadow-neon-strong lg:scale-105'
          : 'border-neon/20 hover:border-neon/50 hover:shadow-neon-sm'
      }`}
    >
      {/* Badge topo */}
      <div className="flex items-center justify-between">
        <span
          className={`badge-neon ${
            popular ? 'bg-neon/20 border-neon text-neon text-glow-sm' : ''
          }`}
        >
          {plan.badge === 'Mais vendido' ? (
            <IconCrown className="h-3.5 w-3.5" />
          ) : plan.badge === 'Melhor para anunciar' ? (
            <IconBolt className="h-3.5 w-3.5" />
          ) : (
            <IconSparkles className="h-3.5 w-3.5" />
          )}
          {plan.badge}
        </span>
        {popular && (
          <span className="hidden rounded-full bg-neon px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-bg-primary sm:inline-block">
            Top
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
      <ul className="mt-6 space-y-2.5">
        {plan.items.map(item => (
          <li
            key={item}
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
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-7 pt-2">
        <a
          href={buildWhatsappUrl(whatsappMessages.plan(plan.name, plan.price))}
          data-analytics-event="plan_click"
          data-plan-name={plan.name}
          data-cta-location="pricing"
          target="_blank"
          rel="noreferrer noopener"
          className={popular ? 'btn-primary w-full animate-pulse-glow' : 'btn-secondary w-full'}
        >
          {popular && <IconWhatsapp className="h-5 w-5" />}
          {plan.cta}
          {!popular && <IconArrowRight className="h-4 w-4" />}
        </a>
        <p className="mt-3 text-center text-xs text-ink-light">
          {plan.microcopy}
        </p>
      </div>

      {/* Glow extra no top */}
      {popular && (
        <>
          <div
            aria-hidden
            className="absolute -inset-px -z-10 rounded-3xl bg-neon/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-neon/40 blur-3xl"
          />
        </>
      )}
    </article>
  )
}

export default function PricingSection() {
  return (
    <section
      id="planos"
      className="relative py-20 sm:py-28"
      aria-labelledby="pricing-title"
    >
      {/* Glow de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-1/2 w-[80%] -translate-x-1/2 bg-radial-green opacity-50"
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconSparkles className="h-3.5 w-3.5" /> Planos
          </span>
          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Escolha a estrutura certa para{' '}
            <span className="text-gradient-neon">vender com mais clareza</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Veja o que cada plano entrega, escolha o que faz sentido para seu
            negócio e confirme tudo pelo WhatsApp antes de iniciar. A entrega
            acontece de 3 a 5 dias após a confirmação do pagamento.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 lg:grid-cols-3 lg:gap-7">
          {PLANS.map(p => (
            <PlanCard
              key={p.key}
              plan={p}
              popular={p.key === 'professional'}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-light">
          * Os valores acima valem para os itens descritos em cada plano. Se
          você precisar de algo fora desse escopo, a opção é apresentada e
          aprovada antes de qualquer alteração.
        </p>
      </div>
    </section>
  )
}
