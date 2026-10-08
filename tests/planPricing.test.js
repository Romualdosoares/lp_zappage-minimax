import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePriceCents, planPriceDetails } from '../src/lib/planPricing.js'
test('preços em reais, vírgula e ponto sem perder centavos', () => {
  assert.equal(parsePriceCents('197,00'),19700)
  assert.equal(parsePriceCents('R$ 1.234,56'),123456)
  assert.equal(parsePriceCents('19.90'),1990)
  for (const value of ['', '0,99', '-1', '0', 'abc', '19,999', 'Infinity', '1e4']) assert.throws(() => parsePriceCents(value))
})
test('12 parcelas sem juros preservam o total com ajuste na última', () => {
  for (let cents = 100; cents < 10000; cents += 7) {
    const details = planPriceDetails(cents)
    assert.equal(details.installmentCents * 11 + details.lastCents, cents)
    assert.ok(details.lastCents > 0)
  }
  assert.equal(planPriceDetails(19700).installment, '12x de R$ 16,42 sem juros')
  assert.equal(planPriceDetails(19700).lastCents,1638)
  assert.equal(planPriceDetails(29700).installmentNote,'')
  assert.equal(planPriceDetails(49700).lastCents,4138)
})
