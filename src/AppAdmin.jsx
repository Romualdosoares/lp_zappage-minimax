import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from './siteConfig'
import {
  deletePortfolioService,
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
  'w-full rounded-xl border border-neon/20 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/25'
const labelClass = 'text-xs font-bold uppercase tracking-wider text-ink-light'
const panelClass =
  'rounded-2xl border border-neon/20 bg-[#071007] p-5 shadow-[0_0_24px_rgba(57,255,20,0.07)]'

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
    `- Fotos: ${asBriefingValue(briefing.photos_status)}`,
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
        <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl">
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

        <nav className="flex gap-2 overflow-x-auto">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
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
            className="shrink-0 rounded-xl border border-neon/20 px-4 py-2 text-sm font-bold text-ink-light"
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

function BriefingPromptPanel({ briefing }) {
  const [copyStatus, setCopyStatus] = useState('')
  const prompt = useMemo(() => generateBriefingPrompt(briefing), [briefing])

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

function BriefingsAdmin({ briefings }) {
  const [selectedId, setSelectedId] = useState(briefings[0]?.id || '')
  const selected = briefings.find(item => item.id === selectedId) || briefings[0]

  useEffect(() => {
    if (!selectedId && briefings[0]) setSelectedId(briefings[0].id)
  }, [briefings, selectedId])

  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className={panelClass}>
        <p className="text-xs font-black uppercase tracking-wider text-neon">
          Respostas recebidas
        </p>
        <h2 className="mt-1 text-2xl font-black text-white">Briefings de clientes</h2>

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
              onClick={() => setSelectedId(item.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected?.id === item.id
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
        {!selected ? (
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
  const [active, setActive] = useState('portfolio')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [portfolio, setPortfolio] = useState([])
  const [briefings, setBriefings] = useState([])

  async function loadAdminData() {
    setLoading(true)
    setMessage('')
    try {
      const currentProfile = await getMyProfile()
      setProfile(currentProfile)

      if (isAdminProfile(currentProfile)) {
        const [portfolioRows, briefingRows] = await Promise.all([
          getPortfolioServices({ admin: true }),
          getBriefingsForAdmin(),
        ])
        setPortfolio(portfolioRows)
        setBriefings(briefingRows)
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
          <StatCard icon={IconShield} label="Banco" value="Supabase" />
        </div>

        {message && (
          <div className="mt-5">
            <StatusMessage type={message.includes('salvo') || message.includes('removido') ? 'info' : 'error'}>
              {message}
            </StatusMessage>
          </div>
        )}

        <div className="mt-6">
          {active === 'portfolio' && (
            <PortfolioAdmin
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              setMessage={setMessage}
            />
          )}
          {active === 'briefings' && <BriefingsAdmin briefings={briefings} />}
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
                  className="rounded-xl border border-neon/30 px-4 py-3 text-sm font-black text-neon"
                >
                  Salvar rascunho
                </button>
                <button
                  type="button"
                  onClick={() => persist('Enviado')}
                  className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black shadow-neon"
                >
                  Enviar briefing
                </button>
              </div>
              {message && (
                <div className="mt-4">
                  <StatusMessage type={message.includes('salvo') || message.includes('enviado') ? 'info' : 'error'}>
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
