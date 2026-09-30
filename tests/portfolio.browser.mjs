// Run against a local Vite server. All external traffic is intercepted; no real records change.
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5174'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' })
const row = i => ({ id: `qa-${i}`, company_name: `Projeto de teste ${i}`, site_url: `https://projeto${i}.example.com`, is_published: true, show_on_landing: true, featured: false, created_at: `2026-09-${String(i).padStart(2, '0')}` })
let rows = Array.from({ length: 6 }, (_, i) => row(i + 1))
rows[5] = { ...rows[5], image_url: 'https://assets.example.com/logo.png', image_kind: 'logo' }
rows[4] = { ...rows[4], image_url: 'https://assets.example.com/preview.png', image_kind: 'preview' }
rows[3] = { ...rows[3], image_url: 'https://assets.example.com/broken.png', image_kind: 'logo' }
let uploaded = false
let failed = false
let saveFailed = false
const errors = []
const publicQueries = []
await context.routeWebSocket(/supabase\.co\/realtime/, socket => socket.close())
await context.route('**/*', async route => {
  const request = route.request(), url = new URL(request.url())
  if (url.origin === base) return route.continue()
  const testLogo = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" rx="120" fill="#14120e"/><circle cx="120" cy="120" r="108" fill="none" stroke="#d4af37" stroke-width="3"/><text x="120" y="140" text-anchor="middle" font-size="58" fill="#e8cb78" font-family="serif">QA</text></svg>'
  if (url.hostname === 'assets.example.com') {
    if (url.pathname === '/broken.png') return route.abort()
    const preview = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"><rect width="1200" height="700" fill="#eee7d9"/><rect width="1200" height="60" fill="#15130e"/><text x="60" y="42" fill="#dcc77f" font-size="28">BARBEARIA · TESTE</text><rect x="680" y="100" width="460" height="480" rx="20" fill="#43402f"/><text x="60" y="220" font-size="58" font-family="serif">Seu estilo.</text><text x="60" y="290" font-size="58" font-family="serif">Sua identidade.</text><rect x="60" y="350" width="260" height="56" rx="28" fill="#b4943f"/></svg>'
    return route.fulfill({ contentType: 'image/svg+xml', body: url.pathname === '/preview.png' ? preview : testLogo })
  }
  if (url.hostname === 'projeto3.example.com' && url.pathname === '/favicon.ico') return route.fulfill({ contentType: 'image/svg+xml', body: testLogo })
  if (!url.hostname.endsWith('.supabase.co')) return route.abort()
  if (url.pathname.includes('/storage/v1/object/')) {
    if (request.method() === 'POST') { uploaded = true; return route.fulfill({ contentType: 'application/json', body: '{}' }) }
    return route.fulfill({ contentType: 'image/svg+xml', body: testLogo })
  }
  let body = []
  if (url.pathname.endsWith('/profiles')) body = [{ id: 'qa-admin', role: 'admin', full_name: 'QA' }]
  if (url.pathname.endsWith('/client_sites')) {
    if (request.method() === 'POST') {
      if (saveFailed) return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'QA: falha ao salvar' }) })
      const saved = { ...request.postDataJSON(), created_at: '2026-09-30' }
      rows = [...rows.filter(item => item.id !== saved.id), saved]
      body = [saved]
    } else if (request.method() === 'DELETE') {
      rows = rows.filter(item => item.id !== url.searchParams.get('id').slice(3))
    } else {
      if (url.searchParams.has('show_on_landing')) publicQueries.push(url.searchParams)
      if (failed) return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'QA offline' }) })
      body = rows.filter(item => (!url.searchParams.has('is_published') || item.is_published) && (!url.searchParams.has('show_on_landing') || item.show_on_landing))
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.created_at.localeCompare(a.created_at))
      if (url.searchParams.has('limit')) body = body.slice(0, Number(url.searchParams.get('limit')))
    }
  }
  return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })
})
await context.addInitScript(() => {
  localStorage.setItem('zapPage.supabaseSession.v1', JSON.stringify({ access_token: 'local-qa-only', user: { id: 'qa-admin' } }))
})
const page = await context.newPage()
page.on('pageerror', error => errors.push(error.message))
const admin = await context.newPage()
admin.on('pageerror', error => errors.push(error.message))
const waitForCards = count => page.waitForFunction(n => document.querySelectorAll('#portfolio article').length === n, count)
try {
  await page.goto(`${base}/#portfolio`)
  await page.locator('#portfolio').scrollIntoViewIfNeeded()
  await waitForCards(6)
  assert.ok(publicQueries.length)
  assert.equal(publicQueries[0].get('limit'), '6')
  assert.equal(publicQueries[0].get('is_published'), 'eq.true')
  await page.locator('.portfolio-image--preview img').waitFor()
  await page.waitForFunction(() => document.querySelector('.portfolio-image--preview img')?.naturalWidth > 0)
  assert.equal(await page.locator('.portfolio-image--preview img').evaluate(el => getComputedStyle(el).objectFit), 'cover')
  await page.locator('#portfolio article').filter({ hasText: 'Projeto de teste 4' }).locator('.portfolio-image-initials').waitFor()
  await page.locator('#portfolio article').filter({ hasText: 'Projeto de teste 3' }).locator('img.portfolio-image-icon').waitFor()
  await mkdir('output/portfolio-qa', { recursive: true })
  await page.locator('#portfolio').screenshot({ path: 'output/portfolio-qa/desktop.png' })
  await admin.goto(`${base}/admin`)
  await admin.getByRole('button', { name: 'Portfólio', exact: true }).click()
  const select = admin.getByRole('checkbox', { name: /Exibir na seção Portfólio/ })
  assert.equal(await select.isDisabled(), true, 'seventh selection must be disabled')
  await admin.getByRole('button', { name: 'Editar', exact: true }).first().click()
  saveFailed = true
  await admin.getByLabel('Nome da empresa', { exact: true }).fill('Não deve ser publicado')
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await admin.getByText('QA: falha ao salvar', { exact: true }).waitFor()
  assert.equal(await page.getByRole('heading', { name: 'Não deve ser publicado', exact: true }).count(), 0)
  saveFailed = false
  const editedName = 'Projeto atualizado pelo painel'
  await admin.getByLabel('Nome da empresa', { exact: true }).fill(editedName)
  await admin.getByRole('combobox', { name: /Tipo de imagem/ }).selectOption('preview')
  await admin.getByLabel('Ou cole o link da imagem', { exact: true }).fill('https://assets.example.com/preview.png')
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await page.getByRole('heading', { name: editedName }).waitFor()
  await page.locator('#portfolio article').filter({ hasText: editedName }).locator('.portfolio-image--preview').waitFor()
  await admin.getByRole('combobox', { name: /Tipo de imagem/ }).selectOption('logo')
  await admin.getByLabel('Enviar logo ou captura', { exact: true }).setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') })
  await admin.getByText('Imagem enviada. Salve o trabalho para publicá-la no portfólio.', { exact: true }).waitFor()
  assert.equal(uploaded, true)
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await page.locator('#portfolio article').filter({ hasText: editedName }).locator('.portfolio-image--logo img').waitFor()
  const fullPortfolio = await context.newPage()
  await fullPortfolio.goto(`${base}/portfolio`)
  await fullPortfolio.getByAltText(`Logo de ${editedName}`, { exact: true }).waitFor()
  await fullPortfolio.close()
  await admin.getByRole('button', { name: 'Remover imagem personalizada', exact: true }).click()
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await page.locator('#portfolio article').filter({ hasText: editedName }).locator('.portfolio-image-initials').waitFor()
  await select.uncheck()
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await waitForCards(5)
  await admin.getByRole('button', { name: 'Novo site', exact: true }).click()
  await admin.getByLabel('Nome da empresa', { exact: true }).fill('Novo trabalho de teste')
  await admin.getByLabel('Link do site', { exact: true }).fill('https://novo.example.com')
  await select.check()
  await admin.getByRole('button', { name: 'Adicionar ao portfólio', exact: true }).click()
  await waitForCards(6)
  await page.getByRole('heading', { name: 'Novo trabalho de teste' }).waitFor()
  await admin.getByRole('checkbox', { name: 'Publicar na página compartilhável' }).uncheck()
  assert.equal(await select.isChecked(), false)
  assert.equal(await select.isDisabled(), true)
  await admin.getByRole('button', { name: 'Salvar alterações', exact: true }).click()
  await waitForCards(5)
  await admin.locator('article').filter({ hasText: 'Projeto de teste 5' }).getByRole('button', { name: 'Remover', exact: true }).click()
  await waitForCards(4)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('#portfolio').scrollIntoViewIfNeeded()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false)
  await page.locator('#portfolio').screenshot({ path: 'output/portfolio-qa/mobile.png' })
  // Simulate a network failure and recovery without discarding the last good list.
  failed = true
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await page.getByText('Não foi possível atualizar os projetos agora.').waitFor()
  await waitForCards(4)
  failed = false
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click()
  await page.getByText('Não foi possível atualizar os projetos agora.').waitFor({ state: 'hidden' })
  rows = []
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await page.getByText(/Em breve, novos projetos por aqui/).waitFor()
  await waitForCards(0)
  failed = true
  await page.reload()
  await page.locator('#portfolio').scrollIntoViewIfNeeded()
  await page.getByText('Não foi possível carregar os projetos agora.', { exact: true }).waitFor()
  failed = false
  rows = [row(1)]
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click()
  await waitForCards(1)
  assert.deepEqual(errors, [])
  console.log('PASS: logos, previews, automatic icon, broken-image fallback, image URL editing/upload/removal/full portfolio; desktop/mobile, six selections, admin changes and live updates, errors/retry; all remote data mocked, no browser errors.')
} catch (error) {
  console.error(await page.locator('#portfolio').evaluate(el => [...el.querySelectorAll('img')].map(img => ({ src: img.src, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height, naturalWidth: img.naturalWidth, complete: img.complete }))))
  throw error
} finally { await browser.close() }
