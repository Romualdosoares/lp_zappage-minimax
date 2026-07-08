import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from './siteConfig'
import {
  createAdminBriefing,
  deleteAdminBriefing,
  deletePortfolioService,
  getAnalyticsEventsForAdmin,
  getBriefingByOrder,
  getBriefingsForAdmin,
  getMyBriefing,
  getMyProfile,
  getPortfolioServices,
  getSession,
  getSupabaseProjectInfo,
  portfolioSeed,
  saveMyBriefing,
  savePortfolioService,
  signIn,
  signOut,
  signUpClient,
  updateAdminBriefing,
  uploadBriefingAsset,
} from './lib/supabaseClient'
import {
  IconArrowRight,
  IconCheckCircle,
  IconClose,
  IconCopy,
  IconLink,
  IconShield,
  IconSparkles,
  IconWhatsapp,
} from './components/Icons'

const inputClass =
  'w-full rounded-xl border border-neon/20 bg-black px-3 py-3 text-base text-white outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/25 sm:text-sm'
const labelClass = 'text-xs font-bold uppercase tracking-wider text-ink-light'
const panelClass =
  'rounded-2xl border border-neon/20 bg-[#071007] p-4 shadow-[0_0_24px_rgba(57,255,20,0.07)] sm:p-5'

function isAdminProfile(profile) {
  return profile?.role === 'admin' || profile?.role === 'master_admin'
}

const emptyBriefing = {
  business_name: '',
  owner_name: '',
  email: '',
  whatsapp: '',
  city: '',
  niche: '',
  instagram: '',
  current_website: '',
  plan_interest: 'Página Profissional',
  main_goal: '',
  audience: '',
  services: '',
  differentials: '',
  prices: '',
  service_area: '',
  tone: 'Profissional e direto',
  brand_colors: '',
  logo_status: 'Tenho logo',
  photos_status: 'Tenho fotos',
  logo_file: null,
  page_images: [],
  required_sections: ['Serviços', 'Diferenciais', 'Contato WhatsApp'],
  reference_links: '',
  objections: '',
  notes: '',
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatDate(value) {
  if (!value) return 'Ainda não enviado'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getOrderLabel(briefing) {
  if (!briefing?.order_number) return '#----'
  return `#${String(briefing.order_number).padStart(4, '0')}`
}

function asBriefingValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Nao informado'
  const text = String(value || '').trim()
  return text || 'Nao informado'
}

function asAssetUrls(value) {
  if (Array.isArray(value)) {
    const urls = value.map(item => item?.url).filter(Boolean)
    return urls.length ? urls.join('\n') : 'Nao informado'
  }
  return value?.url || 'Nao informado'
}

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function generateBriefingPrompt(briefing) {
  const sections = asBriefingValue(briefing.required_sections)
  const lines = [
    `Crie uma landing page profissional para o negocio "${asBriefingValue(briefing.business_name)}".`,
    '',
    'Contexto do cliente:',
    `- Numero da ordem: ${getOrderLabel(briefing)}`,
    `- Responsavel: ${asBriefingValue(briefing.owner_name)}`,
    `- Email: ${asBriefingValue(briefing.email)}`,
    `- WhatsApp: ${asBriefingValue(briefing.whatsapp)}`,
    `- Cidade/regiao: ${asBriefingValue(briefing.city)}`,
    `- Nicho/ramo: ${asBriefingValue(briefing.niche)}`,
    `- Instagram: ${asBriefingValue(briefing.instagram)}`,
    `- Site atual: ${asBriefingValue(briefing.current_website)}`,
    '',
    'Objetivo e oferta:',
    `- Plano de interesse: ${asBriefingValue(briefing.plan_interest)}`,
    `- Objetivo principal: ${asBriefingValue(briefing.main_goal)}`,
    `- Publico atendido: ${asBriefingValue(briefing.audience)}`,
    `- Servicos/produtos: ${asBriefingValue(briefing.services)}`,
    `- Diferenciais: ${asBriefingValue(briefing.differentials)}`,
    `- Precos/condicoes: ${asBriefingValue(briefing.prices)}`,
    `- Area de atendimento: ${asBriefingValue(briefing.service_area)}`,
    '',
    'Direcao visual e estrutura:',
    `- Tom de comunicacao: ${asBriefingValue(briefing.tone)}`,
    `- Cores da marca: ${asBriefingValue(briefing.brand_colors)}`,
    `- Logo: ${asBriefingValue(briefing.logo_status)}`,
    `- Arquivo da logo: ${asAssetUrls(briefing.logo_file)}`,
    `- Fotos: ${asBriefingValue(briefing.photos_status)}`,
    `- Imagens enviadas: ${asAssetUrls(briefing.page_images)}`,
    `- Secoes desejadas: ${sections}`,
    `- Referencias: ${asBriefingValue(briefing.reference_links)}`,
    '',
    'Conversao e confianca:',
    `- Objecoes comuns: ${asBriefingValue(briefing.objections)}`,
    `- Observacoes finais: ${asBriefingValue(briefing.notes)}`,
    '',
    'Instrucoes:',
    '- Mantenha a copy simples, direta e focada em negocio local que atende pelo WhatsApp.',
    '- Nao invente depoimentos, numeros de clientes, certificacoes ou promessas de resultado.',
    '- Organize a pagina com hero forte, servicos, diferenciais, prova de confianca real, FAQ e CTA para WhatsApp.',
    '- Crie uma primeira versao pronta para mobile, com visual premium e leitura rapida.',
  ]

  return lines.join('\n')
}

function getBriefingWhatsappUrl(briefing) {
  const message = [
    `Ola! Confirmo o envio do briefing da ${asBriefingValue(briefing.business_name)}.`,
    `Pedido: ${getOrderLabel(briefing)}.`,
    'As informacoes foram salvas na Zap Page.',
  ].join(' ')

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-28 resize-y leading-relaxed ${props.className || ''}`}
    />
  )
}

function SelectInput(props) {
  return <select {...props} className={`${inputClass} ${props.className || ''}`} />
}

function StatusMessage({ type = 'info', children }) {
  const colors =
    type === 'error'
      ? 'border-red-400/30 bg-red-500/10 text-red-100'
      : 'border-neon/25 bg-neon/10 text-neon'
  return <p className={`rounded-xl border px-3 py-2 text-sm font-bold ${colors}`}>{children}</p>
}

function parseMoney(value) {
  const numeric = String(value || '').replace(/[^\d,]/g, '').replace(',', '.')
  return Number(numeric) || 0
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatPercent(value) {
  return `${Number(value || 0).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}%`
}

function getPlanPrice(planName) {
  const prices = {
    [siteConfig.planExpress.name]: parseMoney(siteConfig.planExpress.price),
    [siteConfig.planProfessional.name]: parseMoney(siteConfig.planProfessional.price),
    [siteConfig.planTurbo.name]: parseMoney(siteConfig.planTurbo.price),
  }
  return prices[planName] || 0
}

function formatDateInputValue(value) {
  const date = value ? new Date(value) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfInputDate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

function endOfInputDate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 999)
}

function isWithinDateRange(value, range) {
  if (!value) return false
  const time = new Date(value).getTime()
  return time >= range.start.getTime() && time <= range.end.getTime()
}

function isSoldBriefing(briefing) {
  return briefing?.status && briefing.status !== 'Rascunho'
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item) || 'Não informado'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function AuthBox({ title, subtitle, admin = false, onReady }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '' })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (mode === 'register') {
        const result = await signUpClient(form)
        if (!result.access_token) {
          setMessage(
            'Cadastro criado. Se o Supabase pedir confirmação de email, confirme e depois entre.',
          )
        } else {
          onReady?.()
        }
      } else {
        await signIn(form.email.trim().toLowerCase(), form.password)
        onReady?.()
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <a href="/" className="flex items-center gap-3">
          <img
            src={siteConfig.logoSrc}
            alt={`${siteConfig.brandName} logo`}
            width={256}
            height={256}
            className="h-12 w-12 rounded-xl border border-neon/30 object-cover shadow-neon-sm"
          />
          <div>
            <p className="text-2xl font-black text-white">{siteConfig.brandName}</p>
            <p className="text-sm font-bold text-neon">{admin ? 'Painel' : 'Briefing'}</p>
          </div>
        </a>
        <h1 className="mt-8 text-3xl font-black leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-light">{subtitle}</p>
        {admin && (
          <div className="mt-5 rounded-2xl border border-neon/20 bg-black p-4 text-sm leading-relaxed text-ink-light">
            Entre com um usuário autorizado para gerenciar serviços e acompanhar os briefings.
          </div>
        )}
      </div>

      <form onSubmit={submit} className={panelClass}>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-neon/20 bg-black p-1">
          {[
            ['login', 'Entrar'],
            ['register', 'Criar acesso'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key)
                setMessage('')
              }}
              className={`rounded-lg px-3 py-2 text-sm font-black ${
                mode === key ? 'bg-neon text-black' : 'text-ink-light'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          {mode === 'register' && (
            <Field label="Nome">
              <TextInput
                value={form.name}
                onChange={event => setForm({ ...form, name: event.target.value })}
                autoComplete="name"
                required
              />
            </Field>
          )}
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={event => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              required
            />
          </Field>
          {mode === 'register' && !admin && (
            <Field label="WhatsApp">
              <TextInput
                type="tel"
                value={form.whatsapp}
                onChange={event => setForm({ ...form, whatsapp: event.target.value })}
                autoComplete="tel"
                placeholder="DDD + número"
                required
              />
            </Field>
          )}
          <Field label="Senha">
            <TextInput
              type="password"
              value={form.password}
              onChange={event => setForm({ ...form, password: event.target.value })}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
            />
          </Field>
        </div>

        {message && (
          <div className="mt-4">
            <StatusMessage type={message.includes('criado') ? 'info' : 'error'}>
              {message}
            </StatusMessage>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3.5 text-sm font-black text-black shadow-neon disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Aguarde...' : mode === 'register' ? 'Criar acesso' : 'Entrar'}
          <IconArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

function AdminHeader({ active, setActive, onLogout }) {
  const tabs = [
    ['dashboard', 'Dashboard'],
    ['portfolio', 'Portfólio'],
    ['briefings', 'Briefings'],
    ['links', 'Links'],
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-neon/15 bg-black/85 backdrop-blur-xl">
      <div className="container-page flex min-h-16 flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src={siteConfig.logoSrc}
            alt={`${siteConfig.brandName} logo`}
            width={256}
            height={256}
            className="h-10 w-10 rounded-xl border border-neon/30 object-cover shadow-neon-sm"
          />
          <div className="leading-tight">
            <p className="text-lg font-black text-white">Painel Zap Page</p>
            <p className="text-xs font-bold text-neon">Admin conectado</p>
          </div>
        </a>

        <nav className="flex w-full gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`shrink-0 rounded-xl px-3 py-2 text-sm font-bold transition sm:px-4 ${
                active === key
                  ? 'bg-neon text-black shadow-neon-sm'
                  : 'border border-neon/20 text-ink-light hover:bg-neon/10 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-xl border border-neon/20 px-3 py-2 text-sm font-bold text-ink-light sm:px-4"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className={panelClass}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 text-neon">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-ink-light">{label}</p>
    </div>
  )
}

function MetricCard({ label, value, detail }) {
  return (
    <article className="rounded-2xl border border-neon/20 bg-[#071007] p-5">
      <p className="text-xs font-black uppercase tracking-wider text-ink-dark">{label}</p>
      <p className="mt-3 break-words text-2xl font-black text-white sm:text-3xl">{value}</p>
      {detail && <p className="mt-2 text-sm leading-relaxed text-ink-light">{detail}</p>}
    </article>
  )
}

function DashboardBars({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className={panelClass}>
      <p className="text-xs font-black uppercase tracking-wider text-neon">{title}</p>
      <div className="mt-5 grid gap-4">
        {items.length === 0 && <p className="text-sm text-ink-light">Sem dados ainda.</p>}
        {items.map(item => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-white">{item.label}</span>
              <span className="font-black text-neon">{item.value}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={total ? Math.max(4, (item.value / total) * 100) : 0} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityList({ title, items, empty }) {
  return (
    <section className={panelClass}>
      <p className="text-xs font-black uppercase tracking-wider text-neon">{title}</p>
      <div className="mt-5 grid gap-3">
        {items.length === 0 && <p className="text-sm text-ink-light">{empty}</p>}
        {items.map(item => (
          <div key={item.id} className="rounded-xl border border-neon/15 bg-black p-4">
            <p className="font-black text-white">{item.title}</p>
            <p className="mt-1 text-sm text-ink-light">{item.detail}</p>
            <p className="mt-2 text-xs font-bold text-neon">{item.meta}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdminDashboard({ briefings, analyticsEvents }) {
  const todayInput = useMemo(() => formatDateInputValue(new Date()), [])
  const sevenDaysAgoInput = useMemo(
    () => formatDateInputValue(Date.now() - 6 * 24 * 60 * 60 * 1000),
    [],
  )
  const [rangeMode, setRangeMode] = useState('30')
  const [customStart, setCustomStart] = useState(sevenDaysAgoInput)
  const [customEnd, setCustomEnd] = useState(todayInput)

  const range = useMemo(() => {
    if (rangeMode === 'custom') {
      const start = startOfInputDate(customStart) || startOfInputDate(todayInput)
      const end = endOfInputDate(customEnd) || endOfInputDate(todayInput)
      const normalizedStart = start <= end ? start : end
      const normalizedEnd = start <= end ? end : start

      return {
        start: normalizedStart,
        end: normalizedEnd,
        label: `${formatDate(normalizedStart)} até ${formatDate(normalizedEnd)}`,
      }
    }

    const days = Number(rangeMode)
    return {
      start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      end: new Date(),
      label: days === 1 ? 'Último dia' : `Últimos ${days} dias`,
    }
  }, [customEnd, customStart, rangeMode, todayInput])

  const filteredBriefings = briefings.filter(item => isWithinDateRange(item.created_at, range))
  const filteredEvents = analyticsEvents.filter(event => isWithinDateRange(event.created_at, range))
  const soldBriefings = filteredBriefings.filter(isSoldBriefing)
  const allSoldBriefings = briefings.filter(isSoldBriefing)
  const pageViews = analyticsEvents.filter(event => event.event_name === 'page_view')
  const pageViewsInRange = filteredEvents.filter(event => event.event_name === 'page_view')
  const visitors = new Set(pageViewsInRange.map(event => event.session_id).filter(Boolean)).size
  const ctaClicks = filteredEvents.filter(event => event.event_name !== 'page_view')
  const planClicks = filteredEvents.filter(event => event.event_name === 'plan_click')
  const clients = new Set(filteredBriefings.map(item => item.email).filter(Boolean)).size
  const uploads = filteredBriefings.filter(
    item => item.logo_file?.url || (Array.isArray(item.page_images) && item.page_images.length),
  ).length
  const estimatedRevenue = soldBriefings.reduce(
    (sum, item) => sum + getPlanPrice(item.plan_interest),
    0,
  )
  const conversion = pageViewsInRange.length
    ? (soldBriefings.length / pageViewsInRange.length) * 100
    : 0

  const planItems = Object.entries(countBy(soldBriefings, item => item.plan_interest))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  const statusItems = Object.entries(countBy(filteredBriefings, item => item.status || 'Rascunho'))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  const eventItems = filteredEvents.slice(0, 6).map(event => ({
    id: event.id,
    title:
      event.event_name === 'page_view'
        ? 'Visualização da página'
        : event.plan_name || event.label || 'Clique registrado',
    detail: event.label || event.path || '-',
    meta: formatDate(event.created_at),
  }))

  const briefingItems = filteredBriefings.slice(0, 6).map(item => ({
    id: item.id,
    title: `${getOrderLabel(item)} ${item.business_name || 'Negócio sem nome'}`,
    detail: item.plan_interest || item.email || '-',
    meta: `${item.status || 'Rascunho'} • ${formatDate(item.updated_at)}`,
  }))

  return (
    <section className="grid gap-5">
      <section className={panelClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neon">
              Filtro por data
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">Métricas do período</h2>
            <p className="mt-2 text-sm text-ink-light">{range.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {[
              ['1', '1 Dia'],
              ['7', '7 Dias'],
              ['15', '15 Dias'],
              ['30', '30 Dias'],
              ['custom', 'Personalizado'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRangeMode(key)}
                className={`rounded-xl px-3 py-2.5 text-sm font-black transition sm:px-4 ${
                  rangeMode === key
                    ? 'bg-neon text-black shadow-neon-sm'
                    : 'border border-neon/20 text-ink-light hover:bg-neon/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {rangeMode === 'custom' && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Data inicial">
              <TextInput
                type="date"
                value={customStart}
                onChange={event => setCustomStart(event.target.value)}
              />
            </Field>
            <Field label="Data final">
              <TextInput
                type="date"
                value={customEnd}
                onChange={event => setCustomEnd(event.target.value)}
              />
            </Field>
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Visualizações"
          value={pageViewsInRange.length}
          detail={`${pageViews.length} no total`}
        />
        <MetricCard
          label="Visitantes"
          value={visitors}
          detail="Sessões únicas no período"
        />
        <MetricCard
          label="Clientes"
          value={clients}
          detail={`${filteredBriefings.length} briefings no período`}
        />
        <MetricCard
          label="Planos vendidos"
          value={soldBriefings.length}
          detail={`${allSoldBriefings.length} no total`}
        />
        <MetricCard
          label="Cliques em CTA"
          value={ctaClicks.length}
          detail={`${planClicks.length} cliques nos planos`}
        />
        <MetricCard
          label="Conversão"
          value={formatPercent(conversion)}
          detail="Pedidos sobre visualizações no período"
        />
        <MetricCard
          label="Receita estimada"
          value={formatCurrency(estimatedRevenue)}
          detail="Com base nos planos registrados"
        />
        <MetricCard
          label="Arquivos enviados"
          value={uploads}
          detail="Briefings com logo ou imagens"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardBars title="Planos vendidos" items={planItems} />
        <DashboardBars title="Status dos pedidos" items={statusItems} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ActivityList
          title="Últimos briefings"
          items={briefingItems}
          empty="Nenhum briefing cadastrado ainda."
        />
        <ActivityList
          title="Últimos eventos da página"
          items={eventItems}
          empty="Nenhum evento registrado ainda."
        />
      </div>
    </section>
  )
}

function PortfolioAdmin({ portfolio, setPortfolio, setMessage }) {
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    id: uid('portfolio'),
    title: '',
    niche: '',
    price: '',
    status: 'Ativo',
    featured: false,
    description: '',
    deliverables: '',
  })

  function editItem(item) {
    setEditingId(item.id)
    setForm(item)
  }

  function resetForm() {
    setEditingId(null)
    setForm({
      id: uid('portfolio'),
      title: '',
      niche: '',
      price: '',
      status: 'Ativo',
      featured: false,
      description: '',
      deliverables: '',
    })
  }

  async function saveItem(event) {
    event.preventDefault()
    try {
      const saved = await savePortfolioService(form)
      const next = portfolio.some(item => item.id === saved.id)
        ? portfolio.map(item => (item.id === saved.id ? saved : item))
        : [saved, ...portfolio]
      setPortfolio(next)
      setEditingId(saved.id)
      setMessage('Serviço salvo no Supabase.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function removeItem(id) {
    try {
      await deletePortfolioService(id)
      setPortfolio(portfolio.filter(item => item.id !== id))
      if (editingId === id) resetForm()
      setMessage('Serviço removido.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neon">
              Vitrine comercial
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">Portfólio de serviços</h2>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-neon px-4 py-2 text-sm font-black text-black"
          >
            Novo
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {portfolio.map(item => (
            <article
              key={item.id}
              className={`rounded-2xl border p-4 transition ${
                editingId === item.id
                  ? 'border-neon bg-neon/10'
                  : 'border-neon/15 bg-black/50 hover:border-neon/45'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-light">{item.niche}</p>
                </div>
                {item.featured && (
                  <span className="rounded-full bg-neon px-2.5 py-1 text-[10px] font-black uppercase text-black">
                    Destaque
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-light">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editItem(item)}
                  className="rounded-lg border border-neon/30 px-3 py-2 text-xs font-bold text-neon"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-200"
                >
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <form onSubmit={saveItem} className={panelClass}>
        <p className="text-xs font-black uppercase tracking-wider text-neon">
          {editingId ? 'Editar serviço' : 'Novo serviço'}
        </p>
        <h3 className="mt-1 text-2xl font-black text-white">Dados do item</h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Nome do serviço">
            <TextInput
              value={form.title}
              onChange={event => setForm({ ...form, title: event.target.value })}
              required
            />
          </Field>
          <Field label="Nicho">
            <TextInput
              value={form.niche || ''}
              onChange={event => setForm({ ...form, niche: event.target.value })}
            />
          </Field>
          <Field label="Preço / chamada">
            <TextInput
              value={form.price || ''}
              onChange={event => setForm({ ...form, price: event.target.value })}
            />
          </Field>
          <Field label="Status">
            <SelectInput
              value={form.status || 'Ativo'}
              onChange={event => setForm({ ...form, status: event.target.value })}
            >
              <option>Ativo</option>
              <option>Oculto</option>
              <option>Em revisão</option>
            </SelectInput>
          </Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Descrição curta">
            <TextArea
              value={form.description || ''}
              onChange={event => setForm({ ...form, description: event.target.value })}
            />
          </Field>
          <Field label="Entregáveis">
            <TextArea
              value={form.deliverables || ''}
              onChange={event => setForm({ ...form, deliverables: event.target.value })}
            />
          </Field>
          <label className="flex items-center gap-3 rounded-xl border border-neon/20 bg-black px-3 py-3">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={event => setForm({ ...form, featured: event.target.checked })}
              className="h-4 w-4 accent-[#39ff14]"
            />
            <span className="text-sm font-bold text-white">Mostrar como destaque</span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3.5 text-sm font-black text-black shadow-neon"
        >
          Salvar serviço
          <IconCheckCircle className="h-5 w-5" />
        </button>
      </form>
    </section>
  )
}

function AssetLinks({ logo, images }) {
  const imageList = Array.isArray(images) ? images : []
  if (!logo?.url && imageList.length === 0) return null

  return (
    <section className="rounded-2xl border border-neon/15 bg-black p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-neon">
        Arquivos enviados
      </p>
      <div className="mt-3 grid gap-2">
        {logo?.url && (
          <a
            href={logo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-xl border border-neon/15 bg-[#071007] px-3 py-2 text-sm font-bold text-white hover:border-neon"
          >
            Logo: {logo.name || 'abrir arquivo'}
          </a>
        )}
        {imageList.map((image, index) => (
          <a
            key={`${image.url}-${index}`}
            href={image.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-xl border border-neon/15 bg-[#071007] px-3 py-2 text-sm font-bold text-white hover:border-neon"
          >
            Imagem {index + 1}: {image.name || 'abrir arquivo'}
          </a>
        ))}
      </div>
    </section>
  )
}

function BriefingPromptPanel({ briefing }) {
  const [copyStatus, setCopyStatus] = useState('')
  const prompt = useMemo(
    () => briefing?.admin_prompt || generateBriefingPrompt(briefing),
    [briefing],
  )

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyStatus('Prompt copiado.')
    } catch {
      setCopyStatus('Nao foi possivel copiar automaticamente.')
    }
  }

  return (
    <section className="rounded-2xl border border-neon/25 bg-black p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-neon">
            Uso interno
          </p>
          <h3 className="mt-1 text-xl font-black text-white">Prompt inicial da pagina</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-light">
            Gerado automaticamente com as respostas do briefing.
          </p>
        </div>
        <button
          type="button"
          onClick={copyPrompt}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-black text-black shadow-neon-sm"
        >
          Copiar prompt
          <IconCopy className="h-5 w-5" />
        </button>
      </div>
      {copyStatus && <p className="mt-3 text-xs font-bold text-neon">{copyStatus}</p>}
      <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl border border-neon/15 bg-[#030803] p-4 text-xs leading-relaxed text-ink-light sm:text-sm">
        {prompt}
      </pre>
    </section>
  )
}

function AdminBriefingCreator({ initialBriefing, onSaved, onCancel, setMessage }) {
  const editing = Boolean(initialBriefing?.id)
  const [form, setForm] = useState({
    ...emptyBriefing,
    status: 'Manual',
    admin_prompt: '',
    ...(initialBriefing || {}),
  })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setForm({
      ...emptyBriefing,
      status: 'Manual',
      admin_prompt: '',
      ...(initialBriefing || {}),
    })
  }, [initialBriefing])

  function update(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function fillPrompt() {
    setForm(current => ({ ...current, admin_prompt: generateBriefingPrompt(current) }))
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (editing) {
        const finalPrompt = (form.admin_prompt?.trim() || generateBriefingPrompt(form)).replace(
          /#----/g,
          getOrderLabel(form),
        )
        const saved = await updateAdminBriefing(initialBriefing.id, {
          ...form,
          admin_prompt: finalPrompt,
        })
        onSaved(saved || { ...form, admin_prompt: finalPrompt })
        setMessage(`Briefing ${getOrderLabel(saved || form)} atualizado.`)
        return
      }

      const created = await createAdminBriefing(form)
      const finalPrompt = (form.admin_prompt?.trim() || generateBriefingPrompt(created)).replace(
        /#----/g,
        getOrderLabel(created),
      )
      const updated = await updateAdminBriefing(created.id, { admin_prompt: finalPrompt })
      onSaved(updated || { ...created, admin_prompt: finalPrompt })
      setMessage(`Novo briefing ${getOrderLabel(updated || created)} criado.`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-neon">
            {editing ? `Editar ${getOrderLabel(form)}` : 'Novo briefing'}
          </p>
          <h3 className="mt-1 text-2xl font-black text-white">
            {editing ? 'Editar briefing do cliente' : 'Criar briefing manual'}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-light">
            {editing
              ? 'Atualize os dados, ajuste o prompt e salve as alterações.'
              : 'Preencha os dados do cliente, gere o prompt pronto e salve para criar a ordem.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-fit rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon"
        >
          Cancelar
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do negócio">
          <TextInput
            value={form.business_name}
            onChange={event => update('business_name', event.target.value)}
            required
          />
        </Field>
        <Field label="Responsável">
          <TextInput
            value={form.owner_name}
            onChange={event => update('owner_name', event.target.value)}
            required
          />
        </Field>
        <Field label="Email do cliente">
          <TextInput
            type="email"
            value={form.email}
            onChange={event => update('email', event.target.value)}
            required
          />
        </Field>
        <Field label="WhatsApp">
          <TextInput
            value={form.whatsapp}
            onChange={event => update('whatsapp', event.target.value)}
            required
          />
        </Field>
        <Field label="Cidade / região">
          <TextInput value={form.city} onChange={event => update('city', event.target.value)} />
        </Field>
        <Field label="Ramo / nicho">
          <TextInput value={form.niche} onChange={event => update('niche', event.target.value)} />
        </Field>
        <Field label="Plano">
          <SelectInput
            value={form.plan_interest}
            onChange={event => update('plan_interest', event.target.value)}
          >
            <option>Página Express</option>
            <option>Página Profissional</option>
            <option>Turbo Vendas</option>
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput value={form.status || 'Manual'} onChange={event => update('status', event.target.value)}>
            <option>Manual</option>
            <option>Rascunho</option>
            <option>Enviado</option>
            <option>Em produção</option>
            <option>Pronto para revisão</option>
            <option>Entregue</option>
          </SelectInput>
        </Field>
        <Field label="Tom">
          <SelectInput value={form.tone} onChange={event => update('tone', event.target.value)}>
            <option>Profissional e direto</option>
            <option>Premium e elegante</option>
            <option>Popular e próximo</option>
            <option>Técnico e objetivo</option>
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Objetivo principal">
          <TextArea value={form.main_goal} onChange={event => update('main_goal', event.target.value)} />
        </Field>
        <Field label="Público atendido">
          <TextArea value={form.audience} onChange={event => update('audience', event.target.value)} />
        </Field>
        <Field label="Serviços ou produtos">
          <TextArea value={form.services} onChange={event => update('services', event.target.value)} />
        </Field>
        <Field label="Diferenciais">
          <TextArea value={form.differentials} onChange={event => update('differentials', event.target.value)} />
        </Field>
        <Field label="Preços, pacotes ou condições">
          <TextArea value={form.prices} onChange={event => update('prices', event.target.value)} />
        </Field>
        <Field label="Objeções comuns">
          <TextArea value={form.objections} onChange={event => update('objections', event.target.value)} />
        </Field>
        <Field label="Observações internas">
          <TextArea value={form.notes} onChange={event => update('notes', event.target.value)} />
        </Field>
      </div>

      <section className="rounded-2xl border border-neon/20 bg-black p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neon">
              Prompt pronto
            </p>
            <p className="mt-1 text-sm text-ink-light">
              Gere automaticamente e ajuste antes de salvar, se precisar.
            </p>
          </div>
          <button
            type="button"
            onClick={fillPrompt}
            className="rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon"
          >
            Gerar prompt
          </button>
        </div>
        <textarea
          value={form.admin_prompt}
          onChange={event => update('admin_prompt', event.target.value)}
          className={`${inputClass} mt-4 min-h-72 resize-y whitespace-pre-wrap leading-relaxed`}
          placeholder="Clique em Gerar prompt ou cole aqui um prompt pronto."
        />
      </section>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-5 py-4 text-sm font-black text-black shadow-neon disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar novo briefing'}
        <IconCheckCircle className="h-5 w-5" />
      </button>
    </form>
  )
}

function BriefingsAdmin({ briefings, setBriefings, setMessage }) {
  const [selectedId, setSelectedId] = useState(briefings[0]?.id || '')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState('')
  const selected = briefings.find(item => item.id === selectedId) || briefings[0]

  useEffect(() => {
    if (!creating && !editingId && !selectedId && briefings[0]) setSelectedId(briefings[0].id)
  }, [briefings, creating, editingId, selectedId])

  function handleSaved(briefing) {
    setBriefings(current => [briefing, ...current.filter(item => item.id !== briefing.id)])
    setSelectedId(briefing.id)
    setCreating(false)
    setEditingId('')
  }

  async function removeBriefing(briefing) {
    if (!briefing?.id) return
    const label = `${getOrderLabel(briefing)} ${briefing.business_name || ''}`.trim()
    const confirmed = window.confirm(`Excluir o briefing ${label}? Esta ação não pode ser desfeita.`)
    if (!confirmed) return

    setMessage('')
    try {
      await deleteAdminBriefing(briefing.id)
      const remaining = briefings.filter(item => item.id !== briefing.id)
      setBriefings(remaining)
      setSelectedId(remaining[0]?.id || '')
      setEditingId('')
      setCreating(false)
      setMessage(`Briefing ${getOrderLabel(briefing)} excluído.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className={panelClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neon">
              Respostas recebidas
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">Briefings de clientes</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setCreating(true)
              setEditingId('')
              setSelectedId('')
            }}
            className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black shadow-neon-sm"
          >
            Novo briefing
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {briefings.length === 0 && (
            <div className="rounded-2xl border border-neon/15 bg-black p-5">
              <p className="font-bold text-white">Nenhum briefing enviado ainda.</p>
              <p className="mt-2 text-sm text-ink-light">
                Envie o link da página de briefing para o cliente preencher.
              </p>
            </div>
          )}

          {briefings.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCreating(false)
                setEditingId('')
                setSelectedId(item.id)
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                !creating && !editingId && selected?.id === item.id
                  ? 'border-neon bg-neon/10'
                  : 'border-neon/15 bg-black/50 hover:border-neon/45'
              }`}
            >
              <p className="font-black text-white">
                {item.business_name || 'Negócio sem nome'}
              </p>
              <p className="mt-1 text-xs font-black text-neon">{getOrderLabel(item)}</p>
              <p className="mt-1 text-sm text-ink-light">{item.email}</p>
              <p className="mt-2 text-xs font-bold text-neon">
                Atualizado em {formatDate(item.updated_at)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className={panelClass}>
        {creating ? (
          <AdminBriefingCreator
            onSaved={handleSaved}
            onCancel={() => setCreating(false)}
            setMessage={setMessage}
          />
        ) : editingId && selected ? (
          <AdminBriefingCreator
            initialBriefing={selected}
            onSaved={handleSaved}
            onCancel={() => setEditingId('')}
            setMessage={setMessage}
          />
        ) : !selected ? (
          <div className="flex min-h-72 items-center justify-center text-center">
            <div>
              <IconCopy className="mx-auto h-10 w-10 text-neon" />
              <p className="mt-3 font-bold text-white">Aguardando primeiro briefing</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-neon">
                  Briefing selecionado
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  {selected.business_name || 'Negócio sem nome'}
                </h3>
                <p className="mt-1 text-sm text-ink-light">{selected.owner_name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="w-fit rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-black text-neon">
                  {getOrderLabel(selected)}
                </span>
                <span className="w-fit rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-black text-neon">
                  {selected.status || 'Rascunho'}
                </span>
                {selected.order_number && (
                  <a
                    href={`/admin/briefing/${selected.order_number}`}
                    className="w-fit rounded-full bg-neon px-3 py-1 text-xs font-black text-black"
                  >
                    Abrir rota interna
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false)
                    setEditingId(selected.id)
                  }}
                  className="w-fit rounded-full border border-neon/30 px-3 py-1 text-xs font-black text-neon"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeBriefing(selected)}
                  className="w-fit rounded-full border border-red-400/40 px-3 py-1 text-xs font-black text-red-200"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ['Email', selected.email],
                ['WhatsApp', selected.whatsapp],
                ['Cidade', selected.city],
                ['Nicho', selected.niche],
                ['Plano', selected.plan_interest],
                ['Tom', selected.tone],
                ['Logo', selected.logo_status],
                ['Fotos', selected.photos_status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-neon/15 bg-black p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-dark">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{value || '-'}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              {[
                ['Objetivo principal', selected.main_goal],
                ['Público', selected.audience],
                ['Serviços', selected.services],
                ['Diferenciais', selected.differentials],
                ['Preços', selected.prices],
                ['Objeções comuns', selected.objections],
                ['Referências', selected.reference_links],
                ['Observações', selected.notes],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-neon/15 bg-black p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-neon">
                    {label}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-light">
                    {value || '-'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <AssetLinks logo={selected.logo_file} images={selected.page_images} />
            </div>

            <div className="mt-5">
              <BriefingPromptPanel briefing={selected} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function LinksPanel() {
  const { url, restUrl } = getSupabaseProjectInfo()
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {[
        ['Portfólio público', '/portfolio'],
        ['Briefing do cliente', '/briefing'],
        ['Landing principal', '/'],
      ].map(([label, href]) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={panelClass}
        >
          <IconLink className="h-6 w-6 text-neon" />
          <p className="mt-4 text-xl font-black text-white">{label}</p>
          <p className="mt-2 text-sm text-ink-light">{href}</p>
        </a>
      ))}
      <div className={`${panelClass} lg:col-span-3`}>
        <p className="text-xs font-black uppercase tracking-wider text-neon">
          Supabase conectado
        </p>
        <p className="mt-2 break-all text-sm text-ink-light">{url}</p>
        <p className="mt-1 break-all text-xs text-ink-dark">{restUrl}</p>
      </div>
    </section>
  )
}

function AdminApp() {
  const [active, setActive] = useState('dashboard')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [portfolio, setPortfolio] = useState([])
  const [briefings, setBriefings] = useState([])
  const [analyticsEvents, setAnalyticsEvents] = useState([])

  async function loadAdminData() {
    setLoading(true)
    setMessage('')
    try {
      const currentProfile = await getMyProfile()
      setProfile(currentProfile)

      if (isAdminProfile(currentProfile)) {
        const [portfolioRows, briefingRows, analyticsRows] = await Promise.all([
          getPortfolioServices({ admin: true }),
          getBriefingsForAdmin(),
          getAnalyticsEventsForAdmin(),
        ])
        setPortfolio(portfolioRows)
        setBriefings(briefingRows)
        setAnalyticsEvents(analyticsRows)
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Painel Administrativo | Zap Page'
    loadAdminData()
  }, [])

  async function logout() {
    await signOut()
    setProfile(null)
    setPortfolio([])
    setBriefings([])
    setAnalyticsEvents([])
  }

  if (!getSession()) {
    return (
      <AuthBox
        admin
        title="Entre no painel administrativo."
        subtitle="Gerencie o portfólio de serviços e acompanhe os briefings enviados pelos clientes."
        onReady={loadAdminData}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="font-black text-neon">Carregando painel...</p>
      </div>
    )
  }

  if (!isAdminProfile(profile)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-5 text-white">
        <div className={panelClass}>
          <IconShield className="h-10 w-10 text-neon" />
          <h1 className="mt-4 text-3xl font-black">Usuário sem acesso administrativo</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-light">
            O login funcionou, mas este usuário ainda não está marcado como administrador no
            Supabase. Marque este usuário como administrador no painel do Supabase e verifique
            novamente.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={loadAdminData}
              className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black"
            >
              Verificar novamente
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.18),transparent_40%),linear-gradient(rgba(57,255,20,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.035)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]"
      />
      <AdminHeader active={active} setActive={setActive} onLogout={logout} />

      <main className="container-page py-6 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={IconSparkles} label="Itens no portfólio" value={portfolio.length} />
          <StatCard icon={IconCopy} label="Briefings recebidos" value={briefings.length} />
          <StatCard icon={IconShield} label="Eventos registrados" value={analyticsEvents.length} />
        </div>

        {message && (
          <div className="mt-5">
            <StatusMessage type={message.includes('salvo') || message.includes('removido') ? 'info' : 'error'}>
              {message}
            </StatusMessage>
          </div>
        )}

        <div className="mt-6">
          {active === 'dashboard' && (
            <AdminDashboard briefings={briefings} analyticsEvents={analyticsEvents} />
          )}
          {active === 'portfolio' && (
            <PortfolioAdmin
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              setMessage={setMessage}
            />
          )}
          {active === 'briefings' && (
            <BriefingsAdmin
              briefings={briefings}
              setBriefings={setBriefings}
              setMessage={setMessage}
            />
          )}
          {active === 'links' && <LinksPanel />}
        </div>
      </main>
    </div>
  )
}

function AdminBriefingRoute({ orderNumber }) {
  const [profile, setProfile] = useState(null)
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadBriefingOrder() {
    setLoading(true)
    setMessage('')
    try {
      const currentProfile = await getMyProfile()
      setProfile(currentProfile)

      if (isAdminProfile(currentProfile)) {
        const row = await getBriefingByOrder(orderNumber)
        setBriefing(row)
        if (!row) setMessage('Nenhum briefing encontrado para esta ordem.')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = `Briefing ${orderNumber} | Zap Page`
    loadBriefingOrder()
  }, [orderNumber])

  async function logout() {
    await signOut()
    setProfile(null)
    setBriefing(null)
  }

  if (!getSession()) {
    return (
      <AuthBox
        admin
        title="Entre para abrir este briefing."
        subtitle="Esta rota é interna e mostra dados do cliente, ordem e prompt de produção."
        onReady={loadBriefingOrder}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="font-black text-neon">Carregando briefing interno...</p>
      </div>
    )
  }

  if (!isAdminProfile(profile)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-5 text-white">
        <div className={panelClass}>
          <IconShield className="h-10 w-10 text-neon" />
          <h1 className="mt-4 text-3xl font-black">Acesso interno bloqueado</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-light">
            Este briefing só pode ser aberto por um usuário administrador.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={loadBriefingOrder}
              className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black"
            >
              Verificar novamente
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.18),transparent_40%),linear-gradient(rgba(57,255,20,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.035)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]"
      />
      <header className="sticky top-0 z-40 border-b border-neon/15 bg-black/85 backdrop-blur-xl">
        <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
          <a href="/admin" className="flex items-center gap-3">
            <img
              src={siteConfig.logoSrc}
              alt={`${siteConfig.brandName} logo`}
              width={256}
              height={256}
              className="h-10 w-10 rounded-xl border border-neon/30 object-cover"
            />
            <div className="leading-tight">
              <p className="font-black text-white">Briefing interno</p>
              <p className="text-xs font-bold text-neon">Ordem #{orderNumber}</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="rounded-xl border border-neon/30 px-3 py-2 text-sm font-black text-neon"
            >
              Painel
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-neon/20 px-3 py-2 text-sm font-bold text-ink-light"
            >
              Sair
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-6 sm:py-10">
        {message && (
          <div className="mb-5">
            <StatusMessage type={briefing ? 'info' : 'error'}>{message}</StatusMessage>
          </div>
        )}

        {!briefing ? (
          <section className={`${panelClass} text-center`}>
            <IconCopy className="mx-auto h-10 w-10 text-neon" />
            <h1 className="mt-4 text-3xl font-black text-white">Briefing não encontrado</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-light">
              Confira se o número da ordem está correto ou volte ao painel para selecionar outro
              briefing.
            </p>
          </section>
        ) : (
          <div className="grid gap-5">
            <section className={panelClass}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-neon">
                    Pedido {getOrderLabel(briefing)}
                  </p>
                  <h1 className="mt-1 text-3xl font-black text-white">
                    {briefing.business_name || 'Negócio sem nome'}
                  </h1>
                  <p className="mt-2 text-sm text-ink-light">
                    Recebido de {briefing.owner_name || briefing.email || 'cliente'}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-black text-neon">
                  {briefing.status || 'Rascunho'}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Email', briefing.email],
                  ['WhatsApp', briefing.whatsapp],
                  ['Cidade', briefing.city],
                  ['Plano', briefing.plan_interest],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-neon/15 bg-black p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-dark">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-bold text-white">
                      {value || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {[
                ['Objetivo principal', briefing.main_goal],
                ['Público', briefing.audience],
                ['Serviços', briefing.services],
                ['Diferenciais', briefing.differentials],
                ['Preços', briefing.prices],
                ['Objeções comuns', briefing.objections],
                ['Referências', briefing.reference_links],
                ['Observações', briefing.notes],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-neon/15 bg-[#071007] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-neon">
                    {label}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-light">
                    {value || '-'}
                  </p>
                </div>
              ))}
            </section>

            <AssetLinks logo={briefing.logo_file} images={briefing.page_images} />

            <BriefingPromptPanel briefing={briefing} />
          </div>
        )}
      </main>
    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-neon shadow-neon-sm transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function CheckboxGroup({ value, onChange }) {
  const options = [
    'Serviços',
    'Diferenciais',
    'Sobre o negócio',
    'Portfólio / fotos',
    'Planos ou preços',
    'FAQ',
    'Contato WhatsApp',
    'Localização',
  ]

  function toggle(option) {
    const next = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option]
    onChange(next)
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(option => (
        <label
          key={option}
          className="flex items-center gap-3 rounded-xl border border-neon/15 bg-black px-3 py-3"
        >
          <input
            type="checkbox"
            checked={value.includes(option)}
            onChange={() => toggle(option)}
            className="h-4 w-4 accent-[#39ff14]"
          />
          <span className="text-sm font-bold text-white">{option}</span>
        </label>
      ))}
    </div>
  )
}

function BriefingForm({ session, onLogout }) {
  const [form, setForm] = useState({
    ...emptyBriefing,
    email: session.user.email,
    owner_name: session.user.user_metadata?.full_name || '',
    whatsapp: session.user.user_metadata?.whatsapp || '',
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState('')
  const [submittedBriefing, setSubmittedBriefing] = useState(null)

  useEffect(() => {
    async function loadBriefing() {
      try {
        const saved = await getMyBriefing()
        if (saved) {
          setForm({ ...emptyBriefing, ...saved })
          if (saved.status === 'Enviado') setSubmittedBriefing(saved)
        }
      } catch (error) {
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadBriefing()
  }, [])

  const filled = useMemo(() => {
    const keys = [
      'business_name',
      'owner_name',
      'whatsapp',
      'city',
      'niche',
      'main_goal',
      'services',
      'differentials',
      'audience',
      'notes',
    ]
    const count = keys.filter(key => String(form[key] || '').trim()).length
    return Math.round((count / keys.length) * 100)
  }, [form])

  function update(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  async function uploadLogo(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setMessage('')
    setUploading('logo')
    try {
      const asset = await uploadBriefingAsset(file, 'logo')
      setForm(current => ({
        ...current,
        logo_file: asset,
        logo_status: 'Logo enviada',
      }))
      setMessage('Logo enviada com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploading('')
      event.target.value = ''
    }
  }

  async function uploadPageImages(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setMessage('')
    setUploading('images')
    try {
      const uploaded = []
      for (const file of files.slice(0, 8)) {
        uploaded.push(await uploadBriefingAsset(file, 'imagens'))
      }
      setForm(current => ({
        ...current,
        page_images: [...(current.page_images || []), ...uploaded],
        photos_status: 'Imagens enviadas',
      }))
      setMessage('Imagens enviadas com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploading('')
      event.target.value = ''
    }
  }

  function removeLogoFile() {
    setForm(current => ({ ...current, logo_file: null }))
  }

  function removePageImage(index) {
    setForm(current => ({
      ...current,
      page_images: (current.page_images || []).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function persist(status) {
    setMessage('')
    try {
      const saved = await saveMyBriefing(form, status)
      setForm({ ...emptyBriefing, ...saved })
      if (status === 'Enviado') {
        setSubmittedBriefing(saved)
        setMessage('')
      } else {
        setSubmittedBriefing(null)
        setMessage('Rascunho salvo.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="font-black text-neon">Carregando briefing...</p>
      </div>
    )
  }

  if (submittedBriefing) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.18),transparent_40%),linear-gradient(rgba(57,255,20,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.035)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]"
        />
        <header className="border-b border-neon/15 bg-black/85 backdrop-blur-xl">
          <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
            <a href="/" className="flex items-center gap-3">
              <img
                src={siteConfig.logoSrc}
                alt={`${siteConfig.brandName} logo`}
                width={256}
                height={256}
                className="h-10 w-10 rounded-xl border border-neon/30 object-cover"
              />
              <div className="leading-tight">
                <p className="font-black text-white">Briefing Zap Page</p>
                <p className="text-xs font-bold text-neon">{session.user.email}</p>
              </div>
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-neon/20 px-3 py-2 text-sm font-bold text-ink-light"
            >
              Sair
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="container-page flex min-h-[calc(100vh-5rem)] items-center py-10">
          <section className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-neon/25 bg-[#071007] p-6 text-center shadow-[0_0_32px_rgba(57,255,20,0.12)] sm:p-8">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon text-black shadow-neon-sm">
              <IconCheckCircle className="h-7 w-7" />
            </span>
            <p className="mt-5 text-xs font-black uppercase tracking-wider text-neon">
              Informações salvas
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Seu briefing foi enviado com sucesso.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-light">
              Pedido {getOrderLabel(submittedBriefing)} confirmado. Em até 2 dias o seu site estará
              pronto para revisão.
            </p>
            <a
              href={getBriefingWhatsappUrl(submittedBriefing)}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-4 text-sm font-black uppercase tracking-wide text-black shadow-neon sm:w-auto"
            >
              Confirmar envio no WhatsApp
              <IconWhatsapp className="h-5 w-5" />
            </a>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-neon/15 bg-black/85 backdrop-blur-xl">
        <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
          <a href="/" className="flex items-center gap-3">
            <img
              src={siteConfig.logoSrc}
              alt={`${siteConfig.brandName} logo`}
              width={256}
              height={256}
              className="h-10 w-10 rounded-xl border border-neon/30 object-cover"
            />
            <div className="leading-tight">
              <p className="font-black text-white">Briefing Zap Page</p>
              <p className="text-xs font-bold text-neon">{session.user.email}</p>
            </div>
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-neon/20 px-3 py-2 text-sm font-bold text-ink-light"
          >
            Sair
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="container-page py-6 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={panelClass}>
              <p className="text-xs font-black uppercase tracking-wider text-neon">
                Progresso
              </p>
              <p className="mt-2 text-4xl font-black text-white">{filled}%</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">
                Quanto mais completo, melhor conseguimos montar a página.
              </p>
              <div className="mt-4">
                <ProgressBar value={filled} />
              </div>
              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={() => persist('Rascunho')}
                  disabled={Boolean(uploading)}
                  className="rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon disabled:cursor-wait disabled:opacity-60"
                >
                  Salvar rascunho
                </button>
                <button
                  type="button"
                  onClick={() => persist('Enviado')}
                  disabled={Boolean(uploading)}
                  className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black shadow-neon disabled:cursor-wait disabled:opacity-60"
                >
                  Enviar briefing
                </button>
              </div>
              {message && (
                <div className="mt-4">
                  <StatusMessage type={message.toLowerCase().includes('sucesso') || message.toLowerCase().includes('salvo') ? 'info' : 'error'}>
                    {message}
                  </StatusMessage>
                </div>
              )}
            </div>
          </aside>

          <form className="grid gap-5">
            <section className={panelClass}>
              <p className="text-xs font-black uppercase tracking-wider text-neon">
                1. Dados do negócio
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Nome do negócio">
                  <TextInput value={form.business_name || ''} onChange={event => update('business_name', event.target.value)} />
                </Field>
                <Field label="Responsável">
                  <TextInput value={form.owner_name || ''} onChange={event => update('owner_name', event.target.value)} />
                </Field>
                <Field label="WhatsApp">
                  <TextInput value={form.whatsapp || ''} onChange={event => update('whatsapp', event.target.value)} />
                </Field>
                <Field label="Cidade / região">
                  <TextInput value={form.city || ''} onChange={event => update('city', event.target.value)} />
                </Field>
                <Field label="Ramo / nicho">
                  <TextInput value={form.niche || ''} onChange={event => update('niche', event.target.value)} />
                </Field>
                <Field label="Instagram">
                  <TextInput value={form.instagram || ''} onChange={event => update('instagram', event.target.value)} />
                </Field>
              </div>
            </section>

            <section className={panelClass}>
              <p className="text-xs font-black uppercase tracking-wider text-neon">
                2. Oferta e conteúdo
              </p>
              <div className="mt-5 grid gap-4">
                <Field label="Principal objetivo da página">
                  <TextArea value={form.main_goal || ''} onChange={event => update('main_goal', event.target.value)} />
                </Field>
                <Field label="Público que você atende">
                  <TextArea value={form.audience || ''} onChange={event => update('audience', event.target.value)} />
                </Field>
                <Field label="Serviços ou produtos principais">
                  <TextArea value={form.services || ''} onChange={event => update('services', event.target.value)} />
                </Field>
                <Field label="Diferenciais do negócio">
                  <TextArea value={form.differentials || ''} onChange={event => update('differentials', event.target.value)} />
                </Field>
                <Field label="Preços, pacotes ou condições">
                  <TextArea value={form.prices || ''} onChange={event => update('prices', event.target.value)} />
                </Field>
              </div>
            </section>

            <section className={panelClass}>
              <p className="text-xs font-black uppercase tracking-wider text-neon">
                3. Visual e estrutura
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Plano de interesse">
                  <SelectInput value={form.plan_interest || 'Página Profissional'} onChange={event => update('plan_interest', event.target.value)}>
                    <option>Página Express</option>
                    <option>Página Profissional</option>
                    <option>Turbo Vendas</option>
                  </SelectInput>
                </Field>
                <Field label="Tom da comunicação">
                  <SelectInput value={form.tone || 'Profissional e direto'} onChange={event => update('tone', event.target.value)}>
                    <option>Profissional e direto</option>
                    <option>Premium e elegante</option>
                    <option>Popular e próximo</option>
                    <option>Técnico e objetivo</option>
                  </SelectInput>
                </Field>
                <Field label="Logo">
                  <SelectInput value={form.logo_status || 'Tenho logo'} onChange={event => update('logo_status', event.target.value)}>
                    <option>Tenho logo</option>
                    <option>Não tenho logo</option>
                    <option>Quero usar apenas o nome</option>
                  </SelectInput>
                </Field>
                <Field label="Fotos">
                  <SelectInput value={form.photos_status || 'Tenho fotos'} onChange={event => update('photos_status', event.target.value)}>
                    <option>Tenho fotos</option>
                    <option>Preciso providenciar fotos</option>
                    <option>Usar layout sem fotos</option>
                  </SelectInput>
                </Field>
                <Field label="Cores da marca">
                  <TextInput value={form.brand_colors || ''} onChange={event => update('brand_colors', event.target.value)} />
                </Field>
                <Field label="Site atual, se houver">
                  <TextInput value={form.current_website || ''} onChange={event => update('current_website', event.target.value)} />
                </Field>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-neon/15 bg-black p-4">
                  <p className={labelClass}>Enviar logo</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={uploadLogo}
                    disabled={uploading === 'logo'}
                    className="mt-3 block w-full text-sm font-bold text-ink-light file:mr-4 file:rounded-xl file:border-0 file:bg-neon file:px-4 file:py-2.5 file:text-sm file:font-black file:text-black"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-ink-dark">
                    PNG, JPG, WEBP ou GIF. Tamanho máximo: 10 MB.
                  </p>
                  {uploading === 'logo' && (
                    <p className="mt-2 text-xs font-bold text-neon">Enviando logo...</p>
                  )}
                  {form.logo_file?.url && (
                    <div className="mt-3 rounded-xl border border-neon/15 bg-[#071007] p-3">
                      <a
                        href={form.logo_file.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="break-all text-sm font-bold text-white hover:text-neon"
                      >
                        {form.logo_file.name || 'Logo enviada'}
                      </a>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-ink-dark">
                          {formatFileSize(form.logo_file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={removeLogoFile}
                          className="text-xs font-black text-neon"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-neon/15 bg-black p-4">
                  <p className={labelClass}>Enviar imagens para a página</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    onChange={uploadPageImages}
                    disabled={uploading === 'images'}
                    className="mt-3 block w-full text-sm font-bold text-ink-light file:mr-4 file:rounded-xl file:border-0 file:bg-neon file:px-4 file:py-2.5 file:text-sm file:font-black file:text-black"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-ink-dark">
                    Envie fotos de serviços, ambiente, produtos, equipe ou materiais da marca.
                  </p>
                  {uploading === 'images' && (
                    <p className="mt-2 text-xs font-bold text-neon">Enviando imagens...</p>
                  )}
                  {Boolean(form.page_images?.length) && (
                    <div className="mt-3 grid gap-2">
                      {form.page_images.map((image, index) => (
                        <div
                          key={`${image.url}-${index}`}
                          className="rounded-xl border border-neon/15 bg-[#071007] p-3"
                        >
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="break-all text-sm font-bold text-white hover:text-neon"
                          >
                            {image.name || `Imagem ${index + 1}`}
                          </a>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-xs text-ink-dark">
                              {formatFileSize(image.size)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePageImage(index)}
                              className="text-xs font-black text-neon"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className={labelClass}>Seções desejadas</p>
                <div className="mt-2">
                  <CheckboxGroup
                    value={form.required_sections || []}
                    onChange={value => update('required_sections', value)}
                  />
                </div>
              </div>
            </section>

            <section className={panelClass}>
              <p className="text-xs font-black uppercase tracking-wider text-neon">
                4. Referências e observações
              </p>
              <div className="mt-5 grid gap-4">
                <Field label="Links de referência">
                  <TextArea value={form.reference_links || ''} onChange={event => update('reference_links', event.target.value)} />
                </Field>
                <Field label="Dúvidas ou objeções comuns dos clientes">
                  <TextArea value={form.objections || ''} onChange={event => update('objections', event.target.value)} />
                </Field>
                <Field label="Observações finais">
                  <TextArea value={form.notes || ''} onChange={event => update('notes', event.target.value)} />
                </Field>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  )
}

function BriefingApp() {
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    document.title = 'Briefing do Cliente | Zap Page'
  }, [])

  async function logout() {
    await signOut()
    setSession(null)
  }

  if (!session) {
    return (
      <AuthBox
        title="Conte tudo que precisamos para criar sua página."
        subtitle="Crie seu acesso, preencha o briefing e volte depois para editar suas informações antes da produção."
        onReady={() => setSession(getSession())}
      />
    )
  }

  return <BriefingForm session={session} onLogout={logout} />
}

function PublicPortfolioApp() {
  const [portfolio, setPortfolio] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.title = 'Portfólio de Serviços | Zap Page'
    getPortfolioServices()
      .then(rows => setPortfolio(rows.length ? rows : portfolioSeed))
      .catch(error => setMessage(error.message))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.2),transparent_42%),linear-gradient(rgba(57,255,20,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.035)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]"
      />
      <header className="border-b border-neon/15 bg-black/85 backdrop-blur-xl">
        <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
          <a href="/" className="flex items-center gap-3">
            <img
              src={siteConfig.logoSrc}
              alt={`${siteConfig.brandName} logo`}
              width={256}
              height={256}
              className="h-10 w-10 rounded-xl border border-neon/30 object-cover"
            />
            <div className="leading-tight">
              <p className="font-black text-white">{siteConfig.brandName}</p>
              <p className="text-xs font-bold text-neon">Portfólio de serviços</p>
            </div>
          </a>
          <a
            href="/briefing"
            className="rounded-xl bg-neon px-4 py-2.5 text-sm font-black text-black shadow-neon-sm"
          >
            Preencher briefing
          </a>
        </div>
      </header>

      <main className="container-page py-12 sm:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-neon">
            <IconSparkles className="h-4 w-4" />
            Serviços Zap Page
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl">
            Páginas profissionais para negócios que atendem pelo WhatsApp
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-light sm:text-lg">
            Escolha uma estrutura, tire dúvidas pelo WhatsApp e depois preencha o
            briefing para começarmos com as informações certas.
          </p>
        </section>

        {message && (
          <div className="mx-auto mt-6 max-w-2xl">
            <StatusMessage type="error">{message}</StatusMessage>
          </div>
        )}

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {portfolio.map(item => (
            <article
              key={item.id}
              className={`flex flex-col rounded-[1.5rem] border p-6 ${
                item.featured
                  ? 'border-neon bg-neon/10 shadow-neon'
                  : 'border-neon/20 bg-[#071007]'
              }`}
            >
              {item.featured && (
                <span className="mb-4 w-fit rounded-full bg-neon px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">
                  Destaque
                </span>
              )}
              <p className="text-sm font-bold text-neon">{item.niche}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-light">
                {item.description}
              </p>
              <div className="mt-5 rounded-xl border border-neon/15 bg-black p-4">
                <p className="text-xs font-black uppercase tracking-wider text-ink-dark">
                  Entrega
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-light">
                  {item.deliverables}
                </p>
              </div>
              <p className="mt-5 text-3xl font-black text-white">{item.price}</p>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Olá! Tenho interesse no serviço: ${item.title}`,
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3 text-sm font-black text-black shadow-neon"
              >
                Chamar no WhatsApp
                <IconWhatsapp className="h-5 w-5" />
              </a>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-neon/25 bg-[#071007] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-black text-white">Já sabe o que precisa?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-light">
            Preencha o briefing para enviar os dados do seu negócio, serviços,
            diferenciais, referências e preferências visuais.
          </p>
          <a
            href="/briefing"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3 text-sm font-black text-black shadow-neon"
          >
            Abrir briefing
            <IconArrowRight className="h-5 w-5" />
          </a>
        </section>
      </main>
    </div>
  )
}

export default function AppAdmin({ mode = 'admin', orderNumber }) {
  if (mode === 'adminBriefing') return <AdminBriefingRoute orderNumber={orderNumber} />
  if (mode === 'briefing') return <BriefingApp />
  if (mode === 'portfolio') return <PublicPortfolioApp />
  return <AdminApp />
}
