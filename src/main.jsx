import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// O painel e as áreas do cliente não fazem parte do caminho crítico da landing.
// Mantê-los em um chunk separado reduz o JavaScript baixado por visitantes públicos.
const AppAdmin = lazy(() => import('./AppAdmin.jsx'))

const publicOrigin = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
const canonicalUrl = `${publicOrigin}${window.location.pathname}`
document.querySelector('[data-site-url="canonical"]')?.setAttribute('href', canonicalUrl)
document.querySelector('[data-site-url="open-graph"]')?.setAttribute('content', canonicalUrl)

const path = window.location.pathname.replace(/\/$/, '') || '/'
const isAdmin = path === '/admin'
const adminBriefingMatch = path.match(/^\/admin\/briefing\/(\d+)$/)
const isBriefing = path === '/briefing'
const isPortfolio = path === '/portfolio'

const AdminRoute = ({ mode, orderNumber }) => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="font-black text-neon">Carregando...</p>
      </div>
    }
  >
    <AppAdmin mode={mode} orderNumber={orderNumber} />
  </Suspense>
)

const AppRoot = isAdmin
  ? <AdminRoute mode="admin" />
  : adminBriefingMatch
    ? <AdminRoute mode="adminBriefing" orderNumber={adminBriefingMatch[1]} />
    : isBriefing
      ? <AdminRoute mode="briefing" />
      : isPortfolio
        ? <AdminRoute mode="portfolio" />
        : <App />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{AppRoot}</React.StrictMode>,
)
