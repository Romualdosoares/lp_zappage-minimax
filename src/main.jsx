import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppAdmin from './AppAdmin.jsx'
import './index.css'

const path = window.location.pathname.replace(/\/$/, '') || '/'
const isAdmin = path === '/admin'
const isBriefing = path === '/briefing'
const isPortfolio = path === '/portfolio'

const AppRoot = isAdmin
  ? <AppAdmin mode="admin" />
  : isBriefing
    ? <AppAdmin mode="briefing" />
    : isPortfolio
      ? <AppAdmin mode="portfolio" />
      : <App />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{AppRoot}</React.StrictMode>,
)
