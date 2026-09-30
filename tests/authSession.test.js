import test from 'node:test'
import assert from 'node:assert/strict'
import { createSessionManager, isExpiredTokenError, withSessionRetry } from '../src/lib/authSession.js'

const jwt = exp => `header.${btoa(JSON.stringify({ exp })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`
const tick = () => new Promise(resolve => setImmediate(resolve))

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
    refresh: async token => { refreshCalls += 1; assert.equal(token, current.refresh_token); return refreshed },
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

test('synchronous refresh failure resets shared promise for next request', async () => {
  const now = 1_700_000_000_000
  const current = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'refresh-token' }
  const failure = new Error('refresh unavailable')
  let refreshCalls = 0
  let clearCalls = 0
  const manager = createSessionManager({
    load: () => current,
    save: () => {},
    clear: () => { clearCalls += 1 },
    refresh: () => { refreshCalls += 1; throw failure },
    now: () => now,
  })

  await assert.rejects(manager.getValidSession(), failure)
  await assert.rejects(manager.getValidSession(), failure)
  assert.equal(refreshCalls, 2)
  assert.equal(clearCalls, 2)
})

test('concurrent expired-session requests share one refresh', async () => {
  const now = 1_700_000_000_000
  const current = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'refresh-token' }
  const refreshed = { access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'next-refresh-token' }
  let refreshCalls = 0
  let releaseRefresh
  const pendingRefresh = new Promise(resolve => { releaseRefresh = resolve })
  const manager = createSessionManager({
    load: () => current,
    save: () => {},
    clear: () => {},
    refresh: async () => { refreshCalls += 1; return pendingRefresh },
    now: () => now,
  })

  const first = manager.getValidSession()
  const second = manager.getValidSession()
  await tick()

  assert.equal(refreshCalls, 1)
  releaseRefresh(refreshed)
  assert.deepEqual(await Promise.all([first, second]), [refreshed, refreshed])
})

test('withSessionRetry refreshes once and retries an expired JWT request', async () => {
  const current = { access_token: jwt(4_000_000_000), refresh_token: 'refresh-token' }
  const refreshed = { access_token: jwt(4_000_003_600), refresh_token: 'next-refresh-token' }
  let refreshCalls = 0
  const sessions = []
  const expiredError = Object.assign(new Error('JWT expired'), { status: 401 })
  const result = await withSessionRetry({
    getValidSession: async ({ forceRefresh = false } = {}) => {
      if (forceRefresh) refreshCalls += 1
      const session = forceRefresh ? refreshed : current
      sessions.push(session)
      return session
    },
    request: async session => {
      if (session === current) throw expiredError
      return { token: session.access_token }
    },
  })

  assert.deepEqual(result, { token: refreshed.access_token })
  assert.deepEqual(sessions, [current, refreshed])
  assert.equal(refreshCalls, 1)
  assert.equal(isExpiredTokenError(expiredError), true)
})

test('isExpiredTokenError rejects non-expired errors', () => {
  assert.equal(isExpiredTokenError(Object.assign(new Error('permission denied'), { status: 401 })), false)
  assert.equal(isExpiredTokenError(Object.assign(new Error('JWT expired'), { status: 500 })), false)
})

test('stale refresh result cannot overwrite a newer signed-in session', async () => {
  const now = 1_700_000_000_000
  const oldSession = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'old-token' }
  const newSession = { access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'new-token' }
  const oldRefresh = { access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'old-next' }
  let stored = oldSession
  let resolveRefresh
  const saved = []
  let clearCalls = 0
  const manager = createSessionManager({
    load: () => stored,
    save: session => { saved.push(session); stored = session },
    clear: () => { clearCalls += 1; stored = null },
    refresh: () => new Promise(resolve => { resolveRefresh = resolve }),
    now: () => now,
  })

  const pending = manager.getValidSession()
  await tick()
  stored = newSession
  resolveRefresh(oldRefresh)

  await assert.rejects(pending, /Sua sessÃ£o foi alterada\. Tente novamente\./)
  assert.equal(stored, newSession)
  assert.deepEqual(saved, [])
  assert.equal(clearCalls, 0)
})

test('refresh for a new refresh token does not join older pending refresh', async () => {
  const now = 1_700_000_000_000
  const oldSession = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'old-token' }
  const newSession = { access_token: jwt(Math.floor(now / 1000) - 1), refresh_token: 'new-token' }
  const newRefresh = { access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'new-next' }
  let stored = oldSession
  const resolvers = new Map()
  const refreshCalls = []
  const saved = []
  const manager = createSessionManager({
    load: () => stored,
    save: session => { saved.push(session); stored = session },
    clear: () => { stored = null },
    refresh: token => new Promise(resolve => {
      refreshCalls.push(token)
      resolvers.set(token, resolve)
    }),
    now: () => now,
  })

  const oldPending = manager.getValidSession()
  await tick()
  stored = newSession
  const newPending = manager.getValidSession()
  await tick()

  assert.deepEqual(refreshCalls, ['old-token', 'new-token'])
  const oldResult = assert.rejects(oldPending, /Sua sessÃ£o foi alterada\. Tente novamente\./)
  resolvers.get('old-token')({ access_token: jwt(Math.floor(now / 1000) + 3_600), refresh_token: 'old-next' })
  resolvers.get('new-token')(newRefresh)

  await oldResult
  assert.equal(await newPending, newRefresh)
  assert.deepEqual(saved, [newRefresh])
})
