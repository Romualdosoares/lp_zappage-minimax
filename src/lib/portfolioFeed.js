// Only published, selected projects with usable links belong on the homepage.
export function selectLandingSites(rows) {
  if (!Array.isArray(rows)) throw new Error('Resposta inválida do portfólio.')
  return rows.filter(site => {
    if (!site.is_published || !site.show_on_landing) return false
    try { return ['http:', 'https:'].includes(new URL(site.site_url).protocol) } catch { return false }
  }).sort((a, b) => Number(b.featured) - Number(a.featured)
    || String(b.created_at).localeCompare(String(a.created_at))
    || String(a.id).localeCompare(String(b.id))).slice(0, 6)
}

export function createPortfolioFeed({ load, subscribe, onData, onError }) {
  let disposed = false
  let sequence = 0
  async function refresh() {
    const request = ++sequence
    try {
      const rows = await load()
      if (!disposed && request === sequence) onData(selectLandingSites(rows))
    } catch (error) {
      if (!disposed && request === sequence) onError(error)
    }
  }
  const unsubscribe = subscribe(refresh)
  refresh()
  return {
    refresh,
    dispose() { disposed = true; unsubscribe() },
  }
}
