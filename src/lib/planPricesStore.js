import { getPlanPrices, subscribeToPlanPrices } from './supabaseClient.js'
import { DEFAULT_PLAN_PRICES, PLAN_KEYS, planPriceDetails } from './planPricing.js'
let prices = { ...DEFAULT_PLAN_PRICES }
let snapshot = buildSnapshot()
let stop, sequence = 0
const listeners = new Set()
function buildSnapshot() { return Object.fromEntries(PLAN_KEYS.map(key => [key, planPriceDetails(prices[key])])) }
export function getPlanPricesSnapshot() { return snapshot }
async function refresh() {
  const request = ++sequence
  try {
    const rows = await getPlanPrices()
    if (request !== sequence) return
    const next = { ...DEFAULT_PLAN_PRICES }
    for (const row of rows) if (PLAN_KEYS.includes(row.plan_key) && Number.isSafeInteger(row.price_cents) && row.price_cents >= 100 && row.price_cents <= 100000000) next[row.plan_key] = row.price_cents
    if (JSON.stringify(next) === JSON.stringify(prices)) return
    prices = next; snapshot = buildSnapshot(); listeners.forEach(listener => listener())
  } catch { /* Mantém o último valor confirmado ou os padrões quando offline. */ }
}
export function subscribePlanPrices(listener) {
  listeners.add(listener)
  if (!stop) {
    refresh()
    const unsubscribe = subscribeToPlanPrices(refresh)
    const visible = () => { if (document.visibilityState === 'visible') refresh() }
    const timer = window.setInterval(visible, 30000)
    window.addEventListener('focus', visible); window.addEventListener('online', visible)
    document.addEventListener('visibilitychange', visible)
    stop = () => {
      unsubscribe(); window.clearInterval(timer)
      window.removeEventListener('focus', visible); window.removeEventListener('online', visible)
      document.removeEventListener('visibilitychange', visible)
      ++sequence; stop = undefined
    }
  }
  return () => { listeners.delete(listener); if (!listeners.size) stop?.() }
}
