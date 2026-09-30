# Renovação de sessão administrativa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renovar automaticamente tokens expirados no painel para que operações administrativas, incluindo salvar benefícios dos planos, continuem autenticadas.

**Architecture:** Um módulo puro de sessão controla expiração do JWT e deduplica refresh simultâneo. `supabaseClient.js` mantém seu cliente REST atual, mas passa a pedir token válido para chamadas protegidas e repete uma única vez respostas de token expirado. Chamadas públicas continuam usando somente a chave anônima.

**Tech Stack:** JavaScript ESM, Node.js `node:test`, React, Vite, Supabase REST/Auth APIs.

---

## Estrutura de arquivos

- Criar `src/lib/authSession.js`: expiração JWT, refresh deduplicado e adaptadores injetáveis para armazenamento e rede.
- Criar `tests/authSession.test.js`: regressões de refresh, falha e concorrência sem acessar rede real.
- Modificar `src/lib/supabaseClient.js`: ligar armazenamento do navegador e Auth API ao módulo; obter token válido em REST e Storage.

### Task 1: Criar teste de expiração e refresh de sessão

**Files:**
- Create: `tests/authSession.test.js`
- Create: `src/lib/authSession.js`

- [ ] **Step 1: Escrever teste que exige refresh para token expirado**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createSessionManager } from '../src/lib/authSession.js'

function jwt(expiresAtSeconds) {
  return `header.${Buffer.from(JSON.stringify({ exp: expiresAtSeconds })).toString('base64url')}.signature`
}

test('renova sessão quando access token está expirado', async () => {
  let stored = { access_token: jwt(1), refresh_token: 'refresh-old', user: { id: 'admin-1' } }
  const calls = []
  const manager = createSessionManager({
    load: () => stored,
    save: session => { stored = session },
    clear: () => { stored = null },
    refresh: async refreshToken => {
      calls.push(refreshToken)
      return { access_token: jwt(4_102_444_800), refresh_token: 'refresh-new', user: { id: 'admin-1' } }
    },
    now: () => 1_700_000_000_000,
  })

  const session = await manager.getValidSession()

  assert.equal(calls.length, 1)
  assert.equal(calls[0], 'refresh-old')
  assert.equal(session.refresh_token, 'refresh-new')
  assert.equal(stored.access_token, session.access_token)
})

test('limpa sessão quando refresh falha', async () => {
  let stored = { access_token: jwt(1), refresh_token: 'revoked' }
  const manager = createSessionManager({
    load: () => stored,
    save: () => assert.fail('não deve salvar'),
    clear: () => { stored = null },
    refresh: async () => { throw new Error('Refresh Token Not Found') },
    now: () => 1_700_000_000_000,
  })

  await assert.rejects(manager.getValidSession(), /Refresh Token Not Found/)
  assert.equal(stored, null)
})
```

- [ ] **Step 2: Rodar teste para confirmar falha esperada**

Run: `node --test tests/authSession.test.js`

Expected: FAIL because `src/lib/authSession.js` does not exist.

- [ ] **Step 3: Implementar módulo mínimo de sessão**

```js
function getJwtExpiry(accessToken) {
  try {
    const payload = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const text = atob(padded)
    const exp = Number(JSON.parse(text).exp)
    return Number.isFinite(exp) ? exp * 1000 : 0
  } catch {
    return 0
  }
}

export function createSessionManager({ load, save, clear, refresh, now = () => Date.now() }) {
  async function getValidSession({ forceRefresh = false } = {}) {
    const session = load()
    if (!session?.access_token) throw new Error('Entre novamente para continuar.')
    if (!forceRefresh && getJwtExpiry(session.access_token) > now() + 30_000) return session
    if (!session.refresh_token) {
      clear()
      throw new Error('Sua sessão expirou. Entre novamente.')
    }
    try {
      const next = await refresh(session.refresh_token)
      save(next)
      return next
    } catch (error) {
      clear()
      throw error
    }
  }
  return { getValidSession }
}
```

- [ ] **Step 4: Rodar teste para confirmar passagem**

Run: `node --test tests/authSession.test.js`

Expected: PASS with `2` tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/authSession.js tests/authSession.test.js
git commit -m "feat: refresh expired admin sessions"
```

### Task 2: Deduplicar refresh concorrente

**Files:**
- Modify: `tests/authSession.test.js`
- Modify: `src/lib/authSession.js`

- [ ] **Step 1: Escrever teste de deduplicação**

```js
test('compartilha refresh entre chamadas simultâneas', async () => {
  let stored = { access_token: jwt(1), refresh_token: 'refresh-old' }
  let calls = 0
  let resolveRefresh
  const manager = createSessionManager({
    load: () => stored,
    save: session => { stored = session },
    clear: () => { stored = null },
    refresh: () => {
      calls += 1
      return new Promise(resolve => { resolveRefresh = resolve })
    },
    now: () => 1_700_000_000_000,
  })

  const first = manager.getValidSession()
  const second = manager.getValidSession()
  resolveRefresh({ access_token: jwt(4_102_444_800), refresh_token: 'refresh-new' })

  assert.equal((await first).access_token, (await second).access_token)
  assert.equal(calls, 1)
})
```

- [ ] **Step 2: Rodar testes para confirmar falha esperada**

Run: `node --test tests/authSession.test.js`

Expected: FAIL because both calls invoke `refresh`, so `calls` equals `2` instead of `1`.

- [ ] **Step 3: Guardar promessa de refresh compartilhada**

```js
export function createSessionManager({ load, save, clear, refresh, now = () => Date.now() }) {
  let refreshPromise = null
  async function getValidSession({ forceRefresh = false } = {}) {
    const session = load()
    if (!session?.access_token) throw new Error('Entre novamente para continuar.')
    if (!forceRefresh && getJwtExpiry(session.access_token) > now() + 30_000) return session
    if (!session.refresh_token) {
      clear()
      throw new Error('Sua sessão expirou. Entre novamente.')
    }
    if (!refreshPromise) {
      refreshPromise = refresh(session.refresh_token)
        .then(next => {
          save(next)
          return next
        })
        .catch(error => {
          clear()
          throw error
        })
        .finally(() => { refreshPromise = null })
    }
    return refreshPromise
  }
  return { getValidSession }
}
```

- [ ] **Step 4: Rodar testes para confirmar passagem**

Run: `node --test tests/authSession.test.js`

Expected: PASS with `3` tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/authSession.js tests/authSession.test.js
git commit -m "test: cover admin session refresh failures"
```

### Task 3: Integrar refresh ao cliente Supabase

**Files:**
- Modify: `src/lib/supabaseClient.js:1-170`
- Test: `tests/authSession.test.js`

- [ ] **Step 1: Escrever teste para refresh forçado após resposta expirada**

```js
import { createSessionManager, withSessionRetry } from '../src/lib/authSession.js'

test('força refresh quando chamada protegida recebe token expirado', async () => {
  let stored = { access_token: jwt(4_102_444_800), refresh_token: 'refresh-old' }
  let refreshCalls = 0
  const manager = createSessionManager({
    load: () => stored,
    save: session => { stored = session },
    clear: () => { stored = null },
    refresh: async () => {
      refreshCalls += 1
      return { access_token: jwt(4_102_444_900), refresh_token: 'refresh-new' }
    },
    now: () => 1_700_000_000_000,
  })
  let requestCalls = 0

  const result = await withSessionRetry({
    getValidSession: manager.getValidSession,
    request: async session => {
      requestCalls += 1
      if (requestCalls === 1) throw Object.assign(new Error('JWT expired'), { status: 401 })
      return session.access_token
    },
  })

  assert.equal(result, stored.access_token)
  assert.equal(requestCalls, 2)
  assert.equal(refreshCalls, 1)
})
```

- [ ] **Step 2: Rodar teste para confirmar falha esperada**

Run: `node --test tests/authSession.test.js`

Expected: FAIL because retry helper is not exported.

- [ ] **Step 3: Integrar gerente e repetição única**

```js
import { createSessionManager, withSessionRetry } from './authSession.js'

const sessionManager = createSessionManager({
  load: getSession,
  save: saveSession,
  clear: clearSession,
  refresh: refreshToken => authRequest('/token?grant_type=refresh_token', { refresh_token: refreshToken }),
})

async function getAuthenticatedSession(options) {
  return sessionManager.getValidSession(options)
}

async function sendRestRequest(path, { method = 'GET', body, token, prefer } = {}) {
  const response = await fetch(`${SUPABASE_REST_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return parseResponse(response)
}

async function restRequest(path, { method = 'GET', body, token, prefer } = {}) {
  if (token) return sendRestRequest(path, { method, body, token, prefer })
  return withSessionRetry({
    getValidSession: getAuthenticatedSession,
    request: session => sendRestRequest(path, { method, body, token: session.access_token, prefer }),
  })
}
```

Add these exact exports to `src/lib/authSession.js`:

```js
export function isExpiredTokenError(error) {
  return error?.status === 401 && /jwt expired|token.*expired/i.test(String(error.message || ''))
}

export async function withSessionRetry({ getValidSession, request }) {
  const session = await getValidSession()
  try {
    return await request(session)
  } catch (error) {
    if (!isExpiredTokenError(error)) throw error
    return request(await getValidSession({ forceRefresh: true }))
  }
}
```

Keep every public reader passing `{ token: SUPABASE_ANON_KEY }`. Remove explicit `session.access_token` arguments from protected REST callers so they use `restRequest` refresh behavior. In `getMyProfile`, `getMyBriefing`, and `saveMyBriefing`, replace `getSession()` with `await getAuthenticatedSession()` before reading `user.id`. In `uploadBriefingAsset`, `getBriefingAssetUrl`, `uploadTestimonialPhoto`, and `uploadPortfolioImage`, replace `getSession()` with `await getAuthenticatedSession()` before building the Storage `Authorization` header.

- [ ] **Step 4: Rodar testes unitários para confirmar passagem**

Run: `node --test tests/authSession.test.js tests/portfolioImages.test.js`

Expected: PASS with zero failures.

- [ ] **Step 5: Commit**

```bash
git add src/lib/authSession.js src/lib/supabaseClient.js tests/authSession.test.js
git commit -m "fix: refresh admin token before saving plans"
```

### Task 4: Verificação de integração

**Files:**
- Verify: `src/lib/authSession.js`
- Verify: `src/lib/supabaseClient.js`
- Verify: `tests/authSession.test.js`
- Verify: `tests/portfolioImages.test.js`

- [ ] **Step 1: Executar todos os testes Node**

Run: `node --test tests/*.test.js`

Expected: PASS with zero failures.

- [ ] **Step 2: Executar build de produção**

Run: `npm run build`

Expected: Vite exits with code `0`.

- [ ] **Step 3: Verificar alterações finais**

Run: `git diff --check; git status --short`

Expected: Sem erro de whitespace; somente arquivos previstos no plano antes do commit final.
