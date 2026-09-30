const SESSION_LEEWAY_MS = 30_000

function getTokenExpiry(accessToken) {
  if (typeof accessToken !== 'string') return null

  const payload = accessToken.split('.')[1]
  if (!payload || typeof globalThis.atob !== 'function') return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = globalThis.atob(padded)
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
    const { exp } = JSON.parse(new TextDecoder().decode(bytes))
    return Number.isFinite(exp) ? exp * 1000 : null
  } catch {
    return null
  }
}

export function isExpiredTokenError(error) {
  if (error?.status !== 401 || typeof error.message !== 'string') return false
  return /\b(?:jwt|token)\b.*\bexpir\w*\b|\bexpir\w*\b.*\b(?:jwt|token)\b/i.test(error.message)
}

function sessionChangedError() {
  return new Error('Sua sessÃ£o foi alterada. Tente novamente.')
}

export async function withSessionRetry({ getValidSession, request }) {
  const session = await getValidSession()

  try {
    return await request(session)
  } catch (error) {
    if (!isExpiredTokenError(error)) throw error
    return request(await getValidSession({
      forceRefresh: true,
      expectedRefreshToken: session.refresh_token,
    }))
  }
}

export function createSessionManager({ load, save, clear, refresh, now = () => Date.now() }) {
  let refreshJob

  function refreshSession(session) {
    if (refreshJob?.token === session.refresh_token) return refreshJob.promise

    const job = { token: session.refresh_token }
    const isSourceSessionCurrent = async () => (await load())?.refresh_token === job.token

    job.promise = Promise.resolve()
      .then(() => refresh(job.token))
      .then(async refreshedSession => {
        if (!await isSourceSessionCurrent()) throw sessionChangedError()
        save(refreshedSession)
        return refreshedSession
      })
      .catch(async error => {
        if (!await isSourceSessionCurrent()) throw sessionChangedError()
        clear()
        throw error
      })
      .finally(() => {
        if (refreshJob === job) refreshJob = null
      })

    refreshJob = job
    return job.promise
  }

  return {
    async getValidSession(options = {}) {
      const { forceRefresh = false, expectedRefreshToken } = options
      const session = await load()
      if (
        Object.prototype.hasOwnProperty.call(options, 'expectedRefreshToken') &&
        session?.refresh_token !== expectedRefreshToken
      ) {
        throw sessionChangedError()
      }
      if (!session?.access_token) throw new Error('Entre novamente para continuar.')

      const expiresAt = getTokenExpiry(session.access_token)
      if (!forceRefresh && expiresAt && expiresAt > now() + SESSION_LEEWAY_MS) return session

      if (!session.refresh_token) {
        clear()
        throw new Error('Sua sessão expirou. Entre novamente.')
      }

      return refreshSession(session)
    },
  }
}
