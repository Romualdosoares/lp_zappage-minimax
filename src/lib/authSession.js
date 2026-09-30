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

export function createSessionManager({ load, save, clear, refresh, now = () => Date.now() }) {
  return {
    async getValidSession({ forceRefresh = false } = {}) {
      const session = await load()
      if (!session?.access_token) throw new Error('Entre novamente para continuar.')

      const expiresAt = getTokenExpiry(session.access_token)
      if (!forceRefresh && expiresAt && expiresAt > now() + SESSION_LEEWAY_MS) return session

      if (!session.refresh_token) {
        clear()
        throw new Error('Sua sessão expirou. Entre novamente.')
      }

      try {
        const refreshedSession = await refresh(session)
        save(refreshedSession)
        return refreshedSession
      } catch (error) {
        clear()
        throw error
      }
    },
  }
}
