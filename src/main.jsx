import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// O painel e as áreas do cliente não fazem parte do caminho crítico da landing.
// Mantê-los em um chunk separado reduz o JavaScript baixado por visitantes públicos.
const AppAdmin = lazy(() => import('./AppAdmin.jsx'))
const DemoPage = lazy(() => import('./components/DemoPage.jsx'))

const routeFallback = (
  <div className="flex min-h-screen items-center justify-center bg-black text-white">
    <p className="font-black text-neon">Carregando...</p>
  </div>
)

const publicOrigin = (import.meta.env.VITE_SITE_URL || 'https://www.zappagepro.com.br').replace(/\/$/, '')
const canonicalUrl = `${publicOrigin}${window.location.pathname}`
document.querySelector('[data-site-url="canonical"]')?.setAttribute('href', canonicalUrl)
document.querySelector('[data-site-url="open-graph"]')?.setAttribute('content', canonicalUrl)

const path = window.location.pathname.replace(/\/$/, '') || '/'
const isAdmin = path === '/admin'
const adminBriefingMatch = path.match(/^\/admin\/briefing\/(\d+)$/)
const isBriefing = path === '/briefing'
const isPortfolio = path === '/portfolio'
const demoMatch = path.match(/^\/demonstracoes\/(barbearia|clinica|restaurante)$/)

const AdminRoute = ({ mode, orderNumber }) => (
  <Suspense
    fallback={routeFallback}
  >
    <AppAdmin mode={mode} orderNumber={orderNumber} />
  </Suspense>
)

const DemoRoute = ({ demoId }) => (
  <Suspense fallback={routeFallback}>
    <DemoPage demoId={demoId} />
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
        : demoMatch
          ? <DemoRoute demoId={demoMatch[1]} />
        : <App />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{AppRoot}</React.StrictMode>,
)
