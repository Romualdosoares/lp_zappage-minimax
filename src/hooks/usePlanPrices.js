import { useSyncExternalStore } from 'react'
import { getPlanPricesSnapshot, subscribePlanPrices } from '../lib/planPricesStore.js'
export default function usePlanPrices() {
  return useSyncExternalStore(subscribePlanPrices, getPlanPricesSnapshot, getPlanPricesSnapshot)
}
