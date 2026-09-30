import test from 'node:test'
import assert from 'node:assert/strict'
import { createSessionManager } from '../src/lib/authSession.js'

const jwt = exp => `header.${btoa(JSON.stringify({ exp })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`

test('expired session refreshes and saves returned session', async () => {
  const now = 1_700_000_000_000
  const current = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'refresh-token' }
  const refreshed = { access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'next-refresh-token' }
  let saved
  let refreshCalls = 0
  let clearCalls = 0
  const manager = createSessionManager({
    load: () => current,
    save: session => { saved = session },
    clear: () => { clearCalls += 1 },
    refresh: async session => { refreshCalls += 1; assert.equal(session, current); return refreshed },
    now: () => now,
  })

  const result = await manager.getValidSession()

  assert.equal(result, refreshed)
  assert.equal(saved, refreshed)
  assert.equal(refreshCalls, 1)
  assert.equal(clearCalls, 0)
})

test('refresh failure clears stored session then rethrows error', async () => {
  const now = 1_700_000_000_000
  const current = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'refresh-token' }
  const failure = new Error('refresh unavailable')
  const events = []
  const manager = createSessionManager({
    load: () => current,
    save: () => events.push('save'),
    clear: () => events.push('clear'),
    refresh: async () => { events.push('refresh'); throw failure },
    now: () => now,
  })

  await assert.rejects(manager.getValidSession(), failure)
  assert.deepEqual(events, ['refresh', 'clear'])
})
