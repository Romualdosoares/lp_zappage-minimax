import { useEffect, useState } from 'react'
import { getPlanPrices, savePlanPrice } from '../lib/supabaseClient.js'
import { DEFAULT_PLAN_PRICES, parsePriceCents, planPriceDetails } from '../lib/planPricing.js'
const plans = [{ key: 'express', name: 'Página Express' }, { key: 'professional', name: 'Página Profissional' }, { key: 'turbo', name: 'Turbo Vendas' }]
export default function PlanPricesManager({ setMessage }) {
  const [drafts, setDrafts] = useState({})
  const [saved, setSaved] = useState({})
  const [pending, setPending] = useState({})
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getPlanPrices({ admin: true }).then(rows => {
      if (!active) return
      const values = { ...DEFAULT_PLAN_PRICES }
      rows.forEach(row => { if (row.plan_key in values) values[row.plan_key] = row.price_cents })
      setSaved(values)
      setDrafts(Object.fromEntries(Object.entries(values).map(([key, cents]) => [key, (cents / 100).toFixed(2).replace('.', ',')])))
    }).catch(() => { if (active) setError('Não foi possível carregar os preços. Verifique a conexão e entre novamente no painel.') })
    return () => { active = false }
  }, [])
  async function save(event, key) {
    event.preventDefault()
    setPending(current => ({ ...current, [key]: true }))
    try {
      const cents = parsePriceCents(drafts[key])
      const row = await savePlanPrice(key, cents)
      setSaved(current => ({ ...current, [key]: row.price_cents }))
      setDrafts(current => ({ ...current, [key]: (row.price_cents / 100).toFixed(2).replace('.', ',') }))
      setMessage('Preço salvo. Página principal e V2 atualizadas automaticamente.')
    } catch (failure) { setMessage('Erro ao salvar preço: ' + failure.message) }
    finally { setPending(current => ({ ...current, [key]: false })) }
  }
  return <section className="admin-panel rounded-2xl border border-neon/25 bg-black p-5">
    <p className="text-xs font-black uppercase tracking-wider text-neon">Página de vendas</p>
    <h2 className="mt-1 text-2xl font-black text-white">Valores dos planos</h2>
    <p className="mt-2 text-sm text-ink-light">Altere o valor à vista. As 12 parcelas sem juros são calculadas automaticamente e publicadas ao salvar.</p>
    {error ? <p role="alert" className="mt-4 text-sm text-red-200">{error}</p> : <div className="mt-5 grid gap-5 lg:grid-cols-3">
      {plans.map(plan => {
        let cents, invalid = ''
        try { cents = parsePriceCents(drafts[plan.key]) } catch (failure) { invalid = failure.message }
        const details = cents ? planPriceDetails(cents) : null
        return <form key={plan.key} onSubmit={event => save(event, plan.key)} className="rounded-2xl border border-neon/20 p-4">
          <h3 className="font-black text-white">{plan.name}</h3>
          <label htmlFor={'price-' + plan.key} className="mt-4 block text-sm text-ink-light">Valor à vista (R$)</label>
          <input id={'price-' + plan.key} inputMode="decimal" required value={drafts[plan.key] ?? ''} disabled={!Object.keys(saved).length || pending[plan.key]} onChange={event => setDrafts(current => ({ ...current, [plan.key]: event.target.value }))} aria-describedby={'installment-' + plan.key} className="admin-field mt-2 min-h-11 w-full rounded-xl border border-neon/25 bg-black px-3 py-2 text-white focus:border-neon focus:ring-2 focus:ring-neon/20" />
          <div id={'installment-' + plan.key} className="mt-3 min-h-20" aria-live="polite">
            {details ? <><p className="font-bold text-neon">{details.installment}</p>{details.installmentNote && <p className="mt-1 text-xs text-ink-light">{details.installmentNote}</p>}</> : <p className="text-sm text-ink-light">{Object.keys(saved).length ? invalid : 'Carregando preços…'}</p>}
          </div>
          <button type="submit" disabled={Boolean(invalid) || !Object.keys(saved).length || cents === saved[plan.key] || pending[plan.key]} className="admin-action mt-4 min-h-11 rounded-full bg-neon px-5 py-2 text-sm font-black text-black hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">{pending[plan.key] ? 'Salvando…' : 'Salvar valor'}</button>
        </form>
      })}
    </div>}
  </section>
}
