import { useEffect, useMemo, useState } from 'react'
import { deletePlanBenefit, savePlanBenefit } from '../lib/supabaseClient'

const PLAN_GROUPS = [
  {
    key: 'express',
    name: 'Página Express',
    description: 'Benefícios exibidos no primeiro card da seção de planos.',
  },
  {
    key: 'professional',
    name: 'Página Profissional',
    description: 'Benefícios exibidos no plano marcado como mais vendido.',
  },
  {
    key: 'turbo',
    name: 'Turbo Vendas',
    description: 'Benefícios exibidos no plano preparado para anúncios.',
  },
]

const inputClass =
  'admin-field w-full rounded-xl border border-neon/20 bg-black px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-ink-dark focus:border-neon focus:ring-2 focus:ring-neon/20 disabled:opacity-60'

function sortedBenefits(items) {
  return [...items].sort(
    (a, b) =>
      Number(a.sort_order || 0) - Number(b.sort_order || 0) ||
      String(a.created_at || '').localeCompare(String(b.created_at || '')),
  )
}

export default function PlanBenefitsManager({ benefits, setBenefits, setMessage, available = true }) {
  const [drafts, setDrafts] = useState({})
  const [newBenefits, setNewBenefits] = useState({})
  const [pending, setPending] = useState({})

  useEffect(() => {
    setDrafts(current => {
      const next = { ...current }
      benefits.forEach(item => {
        if (!(item.id in next)) next[item.id] = item.benefit_text
      })
      return next
    })
  }, [benefits])

  const benefitsByPlan = useMemo(
    () =>
      Object.fromEntries(
        PLAN_GROUPS.map(plan => [
          plan.key,
          sortedBenefits(benefits.filter(item => item.plan_key === plan.key)),
        ]),
      ),
    [benefits],
  )

  function setBusy(key, value) {
    setPending(current => ({ ...current, [key]: value }))
  }

  function replaceBenefit(saved) {
    setBenefits(current =>
      current.some(item => item.id === saved.id)
        ? current.map(item => (item.id === saved.id ? saved : item))
        : [...current, saved],
    )
    setDrafts(current => ({ ...current, [saved.id]: saved.benefit_text }))
  }

  if (!available) {
    return (
      <section className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
        <p className="text-xs font-black uppercase tracking-wider text-amber-200">Configuração pendente</p>
        <h2 className="mt-1 text-2xl font-black text-white">Benefícios dos planos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-amber-50" role="alert">
          A estrutura de benefícios ainda não existe neste Supabase. Aplique a migração{' '}
          <code className="font-black">20260825233000_plan_benefits.sql</code> para liberar criação,
          edição, exclusão e sincronização em tempo real.
        </p>
      </section>
    )
  }

  async function addBenefit(event, planKey) {
    event.preventDefault()
    const text = String(newBenefits[planKey] || '').trim()
    const planItems = benefitsByPlan[planKey] || []
    const nextOrder = Math.max(0, ...planItems.map(item => Number(item.sort_order) || 0)) + 10
    const busyKey = `add-${planKey}`

    setBusy(busyKey, true)
    try {
      const saved = await savePlanBenefit({
        plan_key: planKey,
        benefit_text: text,
        is_active: true,
        sort_order: nextOrder,
      })
      replaceBenefit(saved)
      setNewBenefits(current => ({ ...current, [planKey]: '' }))
      setMessage('Benefício salvo e publicado na página.')
    } catch (error) {
      setMessage(`Erro ao adicionar benefício: ${error.message}`)
    } finally {
      setBusy(busyKey, false)
    }
  }

  async function saveText(item) {
    const busyKey = `save-${item.id}`
    setBusy(busyKey, true)
    try {
      const saved = await savePlanBenefit({
        ...item,
        benefit_text: drafts[item.id],
      })
      replaceBenefit(saved)
      setMessage('Benefício salvo e atualizado na página.')
    } catch (error) {
      setMessage(`Erro ao salvar benefício: ${error.message}`)
    } finally {
      setBusy(busyKey, false)
    }
  }

  async function toggleBenefit(item, isActive) {
    const busyKey = `toggle-${item.id}`
    const previous = item
    setBusy(busyKey, true)
    setBenefits(current =>
      current.map(benefit =>
        benefit.id === item.id ? { ...benefit, is_active: isActive } : benefit,
      ),
    )

    try {
      const saved = await savePlanBenefit({
        ...item,
        benefit_text: drafts[item.id] ?? item.benefit_text,
        is_active: isActive,
      })
      replaceBenefit(saved)
      setMessage(
        isActive
          ? 'Benefício salvo e ativado na página.'
          : 'Benefício salvo e ocultado da página.',
      )
    } catch (error) {
      setBenefits(current =>
        current.map(benefit => (benefit.id === previous.id ? previous : benefit)),
      )
      setMessage(`Erro ao alterar benefício: ${error.message}`)
    } finally {
      setBusy(busyKey, false)
    }
  }

  async function removeBenefit(item) {
    const confirmed = window.confirm(`Excluir o benefício “${item.benefit_text}”?`)
    if (!confirmed) return

    const busyKey = `delete-${item.id}`
    setBusy(busyKey, true)
    try {
      await deletePlanBenefit(item.id)
      setBenefits(current => current.filter(benefit => benefit.id !== item.id))
      setDrafts(current => {
        const next = { ...current }
        delete next[item.id]
        return next
      })
      setMessage('Benefício removido da página.')
    } catch (error) {
      setMessage(`Erro ao excluir benefício: ${error.message}`)
    } finally {
      setBusy(busyKey, false)
    }
  }

  return (
    <section className="admin-panel rounded-2xl border border-neon/25 bg-[#0C0905] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.28),0_0_10px_rgba(212,175,55,0.08)] sm:p-5">
      <div className="flex flex-col gap-3 border-b border-neon/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-neon">Página de vendas</p>
          <h2 className="mt-1 text-2xl font-black text-white">Benefícios dos planos</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-light">
            Marque para publicar, desmarque para ocultar e edite os textos sem precisar alterar o código.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-neon/20 bg-black px-3 py-2 text-xs font-bold text-ink-light">
          <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_14px_rgba(212,175,55,0.18)]" />
          Sincronização automática
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {PLAN_GROUPS.map(plan => {
          const planItems = benefitsByPlan[plan.key] || []
          const activeCount = planItems.filter(item => item.is_active).length

          return (
            <article key={plan.key} className="flex flex-col rounded-2xl border border-neon/15 bg-black/55 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-light">{plan.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-neon/10 px-2.5 py-1 text-[11px] font-black text-neon">
                  {activeCount}/{planItems.length} ativos
                </span>
              </div>

              <div className="mt-4 grid flex-1 content-start gap-2.5">
                {planItems.map(item => {
                  const textChanged = String(drafts[item.id] || '').trim() !== item.benefit_text
                  const isSaving = pending[`save-${item.id}`]
                  const isToggling = pending[`toggle-${item.id}`]
                  const isDeleting = pending[`delete-${item.id}`]
                  const rowBusy = isSaving || isToggling || isDeleting

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-3 transition ${
                        item.is_active
                          ? 'border-neon/20 bg-[#0C0905]'
                          : 'border-white/10 bg-white/[0.025] opacity-65'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-xs font-black text-white">
                          <input
                            type="checkbox"
                            checked={Boolean(item.is_active)}
                            disabled={rowBusy}
                            onChange={event => toggleBenefit(item, event.target.checked)}
                            className="h-4 w-4 accent-[#d4af37]"
                            aria-label={`${item.is_active ? 'Ocultar' : 'Ativar'} ${item.benefit_text}`}
                          />
                          {item.is_active ? 'Ativo' : 'Oculto'}
                        </label>
                        <span className="h-px flex-1 bg-neon/10" />
                      </div>

                      <input
                        value={drafts[item.id] ?? item.benefit_text}
                        disabled={rowBusy}
                        onChange={event =>
                          setDrafts(current => ({ ...current, [item.id]: event.target.value }))
                        }
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            if (textChanged && !rowBusy) saveText(item)
                          }
                        }}
                        maxLength={240}
                        className={`${inputClass} mt-3`}
                        aria-label={`Texto do benefício de ${plan.name}`}
                      />

                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={!textChanged || rowBusy}
                          onClick={() => saveText(item)}
                          className="rounded-lg border border-neon/30 px-3 py-1.5 text-xs font-black text-neon transition hover:bg-neon/10 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          {isSaving ? 'Salvando…' : 'Salvar'}
                        </button>
                        <button
                          type="button"
                          disabled={rowBusy}
                          onClick={() => removeBenefit(item)}
                          className="rounded-lg border border-red-400/25 px-3 py-1.5 text-xs font-black text-red-200 transition hover:bg-red-400/10 disabled:opacity-40"
                        >
                          {isDeleting ? 'Excluindo…' : 'Excluir'}
                        </button>
                      </div>
                    </div>
                  )
                })}

                {!planItems.length && (
                  <p className="rounded-xl border border-dashed border-neon/20 px-3 py-5 text-center text-xs text-ink-light">
                    Nenhum benefício cadastrado neste plano.
                  </p>
                )}
              </div>

              <form onSubmit={event => addBenefit(event, plan.key)} className="mt-4 border-t border-neon/15 pt-4">
                <label className="text-xs font-black uppercase tracking-wider text-ink-light" htmlFor={`new-benefit-${plan.key}`}>
                  Adicionar benefício
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id={`new-benefit-${plan.key}`}
                    value={newBenefits[plan.key] || ''}
                    onChange={event =>
                      setNewBenefits(current => ({ ...current, [plan.key]: event.target.value }))
                    }
                    placeholder="Ex.: Integração com WhatsApp"
                    required
                    minLength={2}
                    maxLength={240}
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={pending[`add-${plan.key}`]}
                    className="shrink-0 admin-action rounded-full bg-neon px-3.5 py-2 text-xs font-black text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending[`add-${plan.key}`] ? '…' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </article>
          )
        })}
      </div>
    </section>
  )
}
