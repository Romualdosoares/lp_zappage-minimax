export function safeImageUrl(value) {
  try {
    const url = new URL(String(value || '').trim())
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch { return '' }
}

export function portfolioImageFields(item) {
  const raw = String(item.image_url || '').trim()
  const image_url = safeImageUrl(raw)
  if (raw && !image_url) throw new Error('Informe um link de imagem com http:// ou https://.')
  return { image_url, image_kind: item.image_kind === 'preview' ? 'preview' : 'logo' }
}

export function siteIconUrl(value) {
  const url = safeImageUrl(value)
  // Treat the icon as card media, rather than the browser's reserved favicon request.
  return url ? new URL('/favicon.ico?portfolio=1', url).href : ''
}

export function companyInitials(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map(word => Array.from(word)[0]).join('').toLocaleUpperCase('pt-BR') || '—'
}

export function validatePortfolioImage(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file?.type)) {
    throw new Error('Escolha uma imagem PNG, JPG ou WebP.')
  }
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter até 5 MB.')
}
