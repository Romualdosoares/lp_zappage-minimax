import { useEffect, useMemo, useState } from 'react'
import {
  getAnalyticsSummaryForAdmin,
  saveCrmTask,
  saveOrder,
  updateAdminBriefing,
  updateCrmTask,
} from '../lib/supabaseClient'

const panelClass = 'rounded-2xl border border-neon/20 bg-[#071007] p-4 shadow-[0_0_24px_rgba(57,255,20,0.07)] sm:p-5'
const inputClass = 'w-full rounded-xl border border-neon/20 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/25'
const PIPELINE = ['Novo lead', 'Contato feito', 'Proposta enviada', 'Pago', 'Briefing', 'Em produção', 'Entregue']

function currency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(value) || 0) / 100)
}

function dateLabel(value) {
  if (!value) return 'Sem data'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value))
}

function dateInput(value) {
  return new Date(value).toISOString().slice(0, 10)
}

function eventCount(events, name) {
  return events.filter(event => event.event_name === name).length
}

function Card({ label, value, detail }) {
  return (
    <article className="rounded-2xl border border-neon/20 bg-[#071007] p-5">
      <p className="text-xs font-black uppercase tracking-wider text-ink-dark">{label}</p>
      <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{value}</p>
      {detail && <p className="mt-2 text-sm text-ink-light">{detail}</p>}
    </article>
  )
}

function Bars({ title, items, suffix = '' }) {
  const max = Math.max(1, ...items.map(item => item.value))
  return (
    <section className={panelClass}>
      <p className="text-xs font-black uppercase tracking-wider text-neon">{title}</p>
      <div className="mt-5 grid gap-3">
        {items.length === 0 && <p className="text-sm text-ink-light">Sem dados no período.</p>}
        {items.map(item => (
          <div key={item.label}>
            <div className="flex justify-between gap-3 text-sm"><span className="font-bold text-white">{item.label}</span><span className="font-black text-neon">{item.value}{suffix}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black"><div className="h-full rounded-full bg-neon" style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function downloadCsv(rows, filename) {
  const headers = Object.keys(rows[0] || {})
  if (!headers.length) return
  const escape = value => `"${String(value ?? '').replaceAll('"', '""')}"`
  const contents = [headers.join(';'), ...rows.map(row => headers.map(key => escape(row[key])).join(';'))].join('\n')
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function AnalyticsPanel({ dashboard, analyticsEvents, briefings, orders }) {
  const [days, setDays] = useState(30)
  const [serverSummary, setServerSummary] = useState(null)
  const end = useMemo(() => new Date(), [])
  const start = useMemo(() => new Date(Date.now() - days * 86400000), [days])

  useEffect(() => {
    let active = true
    getAnalyticsSummaryForAdmin({ startAt: start.toISOString(), endAt: end.toISOString() }).then(summary => {
      if (active && summary) setServerSummary(Array.isArray(summary) ? summary[0] : summary)
    })
    return () => { active = false }
  }, [days, end, start])

  const events = useMemo(
    () => analyticsEvents.filter(event => new Date(event.created_at) >= start && new Date(event.created_at) <= end),
    [analyticsEvents, start, end],
  )
  const views = eventCount(events, 'page_view')
  const visitors = new Set(events.map(event => event.session_id).filter(Boolean)).size
  const planClicks = eventCount(events, 'plan_click')
  const whatsapp = eventCount(events, 'whatsapp_click')
  const checkout = eventCount(events, 'checkout_started')
  const paid = orders.filter(order => order.status === 'paid' && new Date(order.paid_at || order.created_at) >= start).length
  const utms = events.reduce((all, event) => {
    const source = event.metadata?.utm_source || event.metadata?.referrer || 'Direto'
    all[source] = (all[source] || 0) + 1
    return all
  }, {})
  const daily = Array.from({ length: Math.min(days, 14) }, (_, index) => {
    const day = new Date(Date.now() - (Math.min(days, 14) - 1 - index) * 86400000)
    const key = dateInput(day)
    return { label: key.slice(5), value: events.filter(event => dateInput(event.created_at) === key).length }
  })
  const summary = serverSummary || {}
  const sourceItems = Object.entries(utms).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6)

  return (
    <section className="grid gap-5">
      <div className={panelClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-black uppercase tracking-wider text-neon">Aquisição e funil</p><h2 className="mt-1 text-2xl font-black text-white">Métricas de acesso</h2><p className="mt-1 text-sm text-ink-light">Dados filtrados entre {dateLabel(start)} e {dateLabel(end)}.</p></div>
          <div className="flex flex-wrap gap-2">
            {[7, 30, 90].map(value => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-xl px-4 py-2 text-sm font-black ${days === value ? 'bg-neon text-black' : 'border border-neon/20 text-ink-light'}`}>{value} dias</button>)}
            <button type="button" onClick={() => downloadCsv(events.map(event => ({ data: event.created_at, evento: event.event_name, plano: event.plan_name, origem: event.metadata?.utm_source || '', sessao: event.session_id })), 'zap-page-analytics.csv')} className="rounded-xl border border-neon/30 px-4 py-2 text-sm font-black text-neon">Exportar CSV</button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Visualizações" value={summary.page_views ?? views} detail="Páginas carregadas" />
        <Card label="Visitantes" value={summary.unique_sessions ?? visitors} detail="Sessões únicas" />
        <Card label="WhatsApp" value={summary.whatsapp_clicks ?? whatsapp} detail={`${visitors ? ((whatsapp / visitors) * 100).toFixed(1) : 0}% dos visitantes`} />
        <Card label="Conversão paga" value={`${views ? ((paid / views) * 100).toFixed(1) : 0}%`} detail={`${paid} pagamento(s) no período`} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Bars title="Acessos por dia" items={daily} />
        <Bars title="Origem / campanha" items={sourceItems} />
      </div>
      <section className={panelClass}>
        <p className="text-xs font-black uppercase tracking-wider text-neon">Funil comercial</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {[['Visitas', views], ['Planos', planClicks], ['WhatsApp', whatsapp], ['Checkout', checkout], ['Pagos', paid]].map(([label, value], index) => <div key={label} className="rounded-xl border border-neon/15 bg-black p-4"><p className="text-xs font-bold text-ink-light">{index + 1}. {label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></div>)}
        </div>
        <p className="mt-4 text-xs text-ink-dark">O checkout e os pagamentos passam a entrar no funil após configurar o webhook do provedor.</p>
      </section>
      {dashboard && <p className="text-xs text-ink-dark">Resumo agregado fornecido pelo Supabase quando a migração estiver aplicada.</p>}
    </section>
  )
}

function CrmPanel({ briefings, setBriefings, crmTasks, setCrmTasks, setMessage }) {
  const [form, setForm] = useState({ title: '', briefing_id: '', due_at: '', assignee: '', priority: 'normal' })
  const overdue = crmTasks.filter(task => task.status !== 'done' && task.due_at && new Date(task.due_at) < new Date())
  const grouped = PIPELINE.map(stage => ({ label: stage, value: briefings.filter(item => (item.pipeline_stage || item.status || 'Novo lead') === stage).length }))

  async function addTask(event) {
    event.preventDefault()
    try {
      const saved = await saveCrmTask(form)
      setCrmTasks(current => [saved, ...current.filter(item => item.id !== saved.id)])
      setForm({ title: '', briefing_id: '', due_at: '', assignee: '', priority: 'normal' })
      setMessage('Tarefa criada.')
    } catch (error) { setMessage(error.message) }
  }

  async function toggleTask(task) {
    try {
      const saved = await updateCrmTask(task.id, { status: task.status === 'done' ? 'todo' : 'done', completed_at: task.status === 'done' ? null : new Date().toISOString() })
      setCrmTasks(current => current.map(item => item.id === saved.id ? saved : item))
    } catch (error) { setMessage(error.message) }
  }

  async function moveLead(briefing, stage) {
    try {
      const saved = await updateAdminBriefing(briefing.id, { ...briefing, pipeline_stage: stage, status: stage })
      setBriefings(current => current.map(item => item.id === briefing.id ? (saved || { ...item, pipeline_stage: stage, status: stage }) : item))
      setMessage(`Lead movido para ${stage}.`)
    } catch (error) { setMessage(error.message) }
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-neon">Operação comercial</p><h2 className="mt-1 text-2xl font-black text-white">CRM e produção</h2></div><p className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100">{overdue.length} tarefa(s) vencida(s)</p></div>
      <Bars title="Pipeline atual" items={grouped} />
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={addTask} className={panelClass}>
          <p className="text-xs font-black uppercase tracking-wider text-neon">Nova tarefa</p>
          <div className="mt-4 grid gap-3">
            <input className={inputClass} required placeholder="Ex.: Enviar proposta" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
            <select className={inputClass} value={form.briefing_id} onChange={event => setForm({ ...form, briefing_id: event.target.value })}><option value="">Sem briefing vinculado</option>{briefings.map(item => <option key={item.id} value={item.id}>{item.business_name || item.email}</option>)}</select>
            <div className="grid grid-cols-2 gap-3"><input className={inputClass} type="date" value={form.due_at} onChange={event => setForm({ ...form, due_at: event.target.value })} /><input className={inputClass} placeholder="Responsável" value={form.assignee} onChange={event => setForm({ ...form, assignee: event.target.value })} /></div>
            <button className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black">Criar tarefa</button>
          </div>
        </form>
        <section className={panelClass}><p className="text-xs font-black uppercase tracking-wider text-neon">Próximas ações</p><div className="mt-4 grid gap-3">{crmTasks.slice(0, 8).map(task => <button key={task.id} type="button" onClick={() => toggleTask(task)} className="flex items-center justify-between rounded-xl border border-neon/15 bg-black p-3 text-left"><span><span className="block font-bold text-white">{task.title}</span><span className="text-xs text-ink-light">{task.assignee || 'Sem responsável'} · {dateLabel(task.due_at)}</span></span><span className={task.status === 'done' ? 'text-neon' : 'text-amber-200'}>{task.status === 'done' ? 'Feita' : 'Pendente'}</span></button>)}{!crmTasks.length && <p className="text-sm text-ink-light">Nenhuma tarefa cadastrada.</p>}</div></section>
      </div>
      <section className={panelClass}><p className="text-xs font-black uppercase tracking-wider text-neon">Leads recentes</p><div className="mt-4 grid gap-3">{briefings.slice(0, 10).map(item => <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-neon/15 bg-black p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-white">{item.business_name || item.email}</p><p className="text-xs text-ink-light">{item.email}</p></div><select className="rounded-lg border border-neon/20 bg-[#071007] px-3 py-2 text-sm text-white" value={item.pipeline_stage || item.status || 'Novo lead'} onChange={event => moveLead(item, event.target.value)}>{PIPELINE.map(stage => <option key={stage}>{stage}</option>)}</select></div>)}</div></section>
    </section>
  )
}

function FinancePanel({ orders, setOrders, briefings, setMessage }) {
  const [form, setForm] = useState({ customer_name: '', customer_email: '', plan_name: 'Página Express', amount: '197', status: 'pending', provider: 'manual', due_at: '' })
  const received = orders.filter(order => order.status === 'paid').reduce((sum, order) => sum + Number(order.amount_cents || 0), 0)
  const pending = orders.filter(order => ['pending', 'overdue'].includes(order.status)).reduce((sum, order) => sum + Number(order.amount_cents || 0), 0)
  const overdue = orders.filter(order => order.status === 'overdue' || (order.status === 'pending' && order.due_at && new Date(order.due_at) < new Date()))

  async function submit(event) {
    event.preventDefault()
    try {
      const amount = Math.round(Number(String(form.amount).replace(',', '.')) * 100)
      const saved = await saveOrder({ ...form, amount_cents: amount, paid_at: form.status === 'paid' ? new Date().toISOString() : null })
      setOrders(current => [saved, ...current.filter(item => item.id !== saved.id)])
      setForm({ customer_name: '', customer_email: '', plan_name: 'Página Express', amount: '197', status: 'pending', provider: 'manual', due_at: '' })
      setMessage('Pedido financeiro criado.')
    } catch (error) { setMessage(error.message) }
  }

  return (
    <section className="grid gap-5">
      <div><p className="text-xs font-black uppercase tracking-wider text-neon">Receita e cobrança</p><h2 className="mt-1 text-2xl font-black text-white">Financeiro</h2></div>
      <div className="grid gap-4 sm:grid-cols-3"><Card label="Recebido" value={currency(received)} detail="Pedidos pagos" /><Card label="A receber" value={currency(pending)} detail="Pendentes e vencidos" /><Card label="Inadimplência" value={currency(overdue.reduce((sum, order) => sum + Number(order.amount_cents || 0), 0))} detail={`${overdue.length} cobrança(s)`} /></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className={panelClass}><p className="text-xs font-black uppercase tracking-wider text-neon">Lançamento manual</p><div className="mt-4 grid gap-3"><input className={inputClass} required placeholder="Nome do cliente" value={form.customer_name} onChange={event => setForm({ ...form, customer_name: event.target.value })} /><input className={inputClass} required type="email" placeholder="Email" value={form.customer_email} onChange={event => setForm({ ...form, customer_email: event.target.value })} /><div className="grid grid-cols-2 gap-3"><select className={inputClass} value={form.plan_name} onChange={event => setForm({ ...form, plan_name: event.target.value })}>{['Página Express', 'Página Profissional', 'Turbo Vendas'].map(plan => <option key={plan}>{plan}</option>)}</select><input className={inputClass} inputMode="decimal" placeholder="Valor (R$)" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} /></div><div className="grid grid-cols-2 gap-3"><select className={inputClass} value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option value="pending">Pendente</option><option value="paid">Pago</option><option value="overdue">Vencido</option><option value="refunded">Reembolsado</option></select><input className={inputClass} type="date" value={form.due_at} onChange={event => setForm({ ...form, due_at: event.target.value })} /></div><button className="rounded-xl bg-neon px-4 py-3 text-sm font-black text-black">Salvar pedido</button></div></form>
        <section className={panelClass}><p className="text-xs font-black uppercase tracking-wider text-neon">Integração de pagamentos</p><p className="mt-3 text-sm leading-relaxed text-ink-light">O endpoint <code>/api/payment-webhook</code> recebe atualizações assinadas do gateway e atualiza o status com credenciais somente de servidor.</p><p className="mt-3 text-sm text-ink-light">Antes de ativar, configure <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>PAYMENT_WEBHOOK_SECRET</code> e os links reais de checkout na Vercel.</p><p className="mt-3 text-xs text-ink-dark">{briefings.length} briefing(s) podem ser associados aos pedidos pela API ou automação do checkout.</p></section>
      </div>
      <section className={panelClass}><div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-wider text-neon">Pedidos recentes</p><button type="button" onClick={() => downloadCsv(orders, 'zap-page-financeiro.csv')} className="text-sm font-black text-neon">Exportar CSV</button></div><div className="mt-4 grid gap-3">{orders.slice(0, 12).map(order => <div key={order.id} className="flex flex-col gap-1 rounded-xl border border-neon/15 bg-black p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-white">{order.customer_name} · {order.plan_name}</p><p className="text-xs text-ink-light">{order.customer_email} · {dateLabel(order.created_at)}</p></div><div className="text-left sm:text-right"><p className="font-black text-neon">{currency(order.amount_cents)}</p><p className="text-xs text-ink-light">{order.status}</p></div></div>)}{!orders.length && <p className="text-sm text-ink-light">Nenhum lançamento financeiro ainda.</p>}</div></section>
    </section>
  )
}

export default function AdminOperationsPanels(props) {
  if (props.section === 'crm') return <CrmPanel {...props} />
  if (props.section === 'finance') return <FinancePanel {...props} />
  return <AnalyticsPanel {...props} dashboard={props.section === 'dashboard'} />
}
