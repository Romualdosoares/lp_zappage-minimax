export const PLAN_KEYS = ['express', 'professional', 'turbo']
export const DEFAULT_PLAN_PRICES = { express: 19700, professional: 29700, turbo: 49700 }
export function parsePriceCents(value) {
  const text = String(value ?? '').trim().replace(/^R\$\s*/, '')
  const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error('Informe um valor válido com até duas casas decimais.')
  const cents = Math.round(Number(normalized) * 100)
  if (!Number.isSafeInteger(cents) || cents < 100 || cents > 100000000) throw new Error('Informe um valor entre R$ 1,00 e R$ 1.000.000,00.')
  return cents
}
export function formatPrice(cents) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\u00a0/g, ' ')
}
export function planPriceDetails(cents) {
  // A última parcela absorve o arredondamento, preservando o total sem juros.
  const installmentCents = Math.round(cents / 12)
  const lastCents = cents - installmentCents * 11
  return {
    price: formatPrice(cents),
    installment: '12x de ' + formatPrice(installmentCents) + ' sem juros',
    installmentNote: lastCents === installmentCents ? '' : '11 parcelas de ' + formatPrice(installmentCents) + ' e última de ' + formatPrice(lastCents) + '. Total: ' + formatPrice(cents) + '.',
    installmentCents, lastCents,
  }
}
