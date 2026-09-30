import test from 'node:test'
import assert from 'node:assert/strict'
import { createPortfolioFeed, selectLandingSites } from '../src/lib/portfolioFeed.js'

const site = (id, extra = {}) => ({ id, company_name: id, site_url: `https://${id}.example.com`, is_published: true, show_on_landing: true, featured: false, created_at: '2026-09-30', ...extra })
const tick = () => new Promise(resolve => setImmediate(resolve))

test('shows at most six published selections, prioritizes featured, rejects unsafe links', () => {
  const rows = [site('hidden', { is_published: false }), site('other', { show_on_landing: false }), site('unsafe', { site_url: 'javascript:alert(1)' }), site('broken', { site_url: 'invalid' }), ...Array.from({ length: 8 }, (_, i) => site(`site${i}`)), site('featured', { featured: true })]
  const result = selectLandingSites(rows)
  assert.equal(result.length, 6)
  assert.equal(result[0].id, 'featured')
  assert.ok(result.every(row => !['hidden', 'other', 'unsafe', 'broken'].includes(row.id)))
  assert.throws(() => selectLandingSites(null))
})

test('live signals reflect additions, edits, unpublishing and deletion without reloading', async () => {
  let rows = []
  let notify
  const updates = []
  let unsubscribed = false
  const feed = createPortfolioFeed({ load: async () => rows, subscribe: cb => { notify = cb; return () => { unsubscribed = true } }, onData: data => updates.push(data), onError: assert.fail })
  await tick()
  rows = [site('first')]; await notify()
  rows = [site('first', { company_name: 'Edited' }), site('second')]; await notify()
  assert.equal(updates.at(-1)[0].company_name, 'Edited')
  rows = [site('first', { is_published: false }), site('second')]; await notify()
  assert.deepEqual(updates.at(-1).map(row => row.id), ['second'])
  rows = []; await notify()
  assert.deepEqual(updates.at(-1), [])
  feed.dispose()
  assert.ok(unsubscribed)
})

test('out-of-order responses and failures never replace the newest result', async () => {
  const pending = []
  const updates = [], errors = []
  const feed = createPortfolioFeed({ load: () => new Promise((resolve, reject) => pending.push({ resolve, reject })), subscribe: () => () => {}, onData: data => updates.push(data), onError: error => errors.push(error) })
  const fresh = feed.refresh()
  pending[1].resolve([site('new')]); await fresh
  pending[0].reject(new Error('stale failure')); await tick()
  assert.equal(errors.length, 0)
  const old = feed.refresh(), latest = feed.refresh()
  pending[3].resolve([site('latest')]); await latest
  pending[2].resolve([site('old')]); await old
  assert.equal(updates.at(-1)[0].id, 'latest')
  const failing = feed.refresh(); pending[4].reject(new Error('offline')); await failing
  assert.equal(errors.length, 1)
  assert.equal(updates.at(-1)[0].id, 'latest')
  const unmounted = feed.refresh(); feed.dispose(); pending[5].resolve([]); await unmounted
  assert.equal(updates.at(-1)[0].id, 'latest')
})
