import test from 'node:test'
import assert from 'node:assert/strict'
import { companyInitials, portfolioImageFields, safeImageUrl, siteIconUrl, validatePortfolioImage } from '../src/lib/portfolioImages.js'

test('image links accept only http(s), and legacy records default to logo', () => {
  assert.deepEqual(portfolioImageFields({}), { image_url: '', image_kind: 'logo' })
  assert.deepEqual(portfolioImageFields({ image_url: ' https://example.com/logo.png ', image_kind: 'preview' }), { image_url: 'https://example.com/logo.png', image_kind: 'preview' })
  for (const url of ['javascript:alert(1)', 'data:image/svg+xml,anything', 'file:///logo.png', 'invalid']) {
    assert.equal(safeImageUrl(url), '')
    assert.throws(() => portfolioImageFields({ image_url: url }))
  }
  assert.equal(siteIconUrl('https://example.com/some/path'), 'https://example.com/favicon.ico?portfolio=1')
  assert.equal(siteIconUrl('invalid'), '')
})

test('initials work for missing names, accents and whitespace', () => {
  assert.equal(companyInitials('  Lord   Barbearia '), 'LB')
  assert.equal(companyInitials('Átila'), 'Á')
  assert.equal(companyInitials(''), '—')
})

test('uploads reject unsupported types, empty and oversized files', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) assert.doesNotThrow(() => validatePortfolioImage({ type, size: 5242880 }))
  for (const file of [{ type: 'image/svg+xml', size: 100 }, { type: 'image/png', size: 5242881 }, { type: 'image/png', size: 0 }]) assert.throws(() => validatePortfolioImage(file))
})
