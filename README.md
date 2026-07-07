# Zap Page — Landing Page

Landing page premium, mobile-first e otimizada para conversão, feita em **React + Vite + Tailwind CSS**, com identidade visual em **preto + verde fluorescente**. Pronta pra subir no **Vercel** com um clique.

---

## ✨ Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (com paleta custom)
- **Zero dependências de UI pesadas** — todos os ícones são SVGs inline
- **Sem imagens externas obrigatórias** — mockups do celular e notebook são feitos em CSS puro
- **Acessível**: alto contraste, botões grandes, foco visível, suporte a `prefers-reduced-motion`

---

## 🚀 Rodar local

```bash
npm install
npm run dev        # dev server em http://localhost:5173
npm run build      # gera /dist (build de produção)
npm run preview    # serve /dist em http://localhost:4173
```

Build já foi validado localmente:
- 53 módulos transformados
- `index.html` 2.76 kB (gzip 1.17 kB)
- CSS 34.92 kB (gzip 6.68 kB)
- JS app 69.95 kB (gzip 15.91 kB)
- React vendor 140.87 kB (gzip 45.26 kB)

---

## ☁️ Deploy no Vercel — 3 caminhos

O projeto já vem com `vercel.json`, `.vercelignore`, `.nvmrc` (`node 20`) e `package.json` com `engines.node >= 18.18`. Então **não precisa configurar nada na dashboard**.

### Opção A — Dashboard (a mais simples)

1. Suba o projeto para um repositório no **GitHub** (público ou privado).
2. Acesse [vercel.com/new](https://vercel.com/new) → **Import Project**.
3. Selecione o repositório.
4. O Vercel detecta **Vite** automaticamente. Confirme:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **Deploy**. Em ~1 minuto você recebe a URL `https://seu-projeto.vercel.app`.

### Opção B — Vercel CLI (do terminal, sem Git)

```bash
# 1. instale a CLI (uma vez só)
npm i -g vercel

# 2. login
vercel login

# 3. deploy (dentro da pasta do projeto)
vercel              # primeiro deploy: cria o projeto e pergunta domínio
vercel --prod       # promoção pra produção
```

A CLI detecta o `vercel.json` e usa os comandos/paths que estão lá.

### Opção C — Botão "Deploy to Vercel" (1-clique)

Cole isto no seu README público se quiser:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU-USER/zap-page)
```

---

## 🛠 O que o `vercel.json` já configura

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [
    { "src": "/(.*)\\.(js|css|woff2?|...)", "Cache-Control": "public, max-age=31536000, immutable" },
    { "src": "/(.*)", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "SAMEORIGIN", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" }
  ]
}
```

- **Rewrites**: roteia qualquer rota pra `/` (SPA fallback). Útil se depois você adicionar React Router ou páginas adicionais.
- **Cache imutável** de 1 ano em arquivos com hash (JS/CSS/assets).
- **Headers de segurança** básicos (XSS, clickjacking, referrer).

> Se quiser domínio próprio, basta ir em **Project Settings → Domains** e adicionar.

---

## 🌐 Domínio personalizado (opcional)

1. Compre o domínio (Registro.br, Cloudflare, Namecheap etc).
2. No Vercel: **Settings → Domains → Add**.
3. Configure os DNS:
   - **Apex (`seudominio.com.br`)** → `76.76.21.21`
   - **WWW (`www.seudominio.com.br`)** → CNAME `cname.vercel-dns.com`
4. Aguarde a propagação (10 min a 24h). Vercel gera SSL automático (Let's Encrypt).

---

## 📁 Estrutura

```
.
├── index.html                  # entrada + SEO + Open Graph
├── package.json                # deps + scripts + engines
├── vite.config.js              # code-splitting do React
├── tailwind.config.js          # paleta + animações custom
├── postcss.config.js           # autoprefixer
├── vercel.json                 # ⭐ config de deploy
├── .vercelignore
├── .nvmrc
├── README.md
├── src/
│   ├── main.jsx                # bootstrap React
│   ├── App.jsx                 # orquestra todas as seções
│   ├── index.css               # Tailwind + utilitários + animações
│   ├── siteConfig.js           # ⭐ TODA a config editável
│   └── components/
│       ├── TopOfferBar.jsx
│       ├── Header.jsx
│       ├── HeroSection.jsx
│       ├── TrustStrip.jsx
│       ├── ProblemSection.jsx
│       ├── TransformationSection.jsx
│       ├── DeliverablesSection.jsx
│       ├── SupportSection.jsx
│       ├── NichesSection.jsx
│       ├── HowItWorksSection.jsx
│       ├── SpecialOfferSection.jsx
│       ├── PricingSection.jsx
│       ├── PlanComparisonSection.jsx
│       ├── BonusSection.jsx
│       ├── ObjectionsSection.jsx
│       ├── FAQSection.jsx
│       ├── FinalCTASection.jsx
│       ├── Footer.jsx
│       ├── StickyWhatsAppButton.jsx
│       ├── MobileStickyCTA.jsx
│       └── Icons.jsx
```

---

## ⚙️ Onde editar o que

Abra **`src/siteConfig.js`**. **Tudo que muda com frequência está lá:**

| Campo | O que faz |
|-------|-----------|
| `brandName` | Nome exibido no header, footer e meta tags |
| `tagline` | Subtítulo da marca |
| `whatsappNumber` | Número para gerar `wa.me/...` (formato: DDI + DDD + número, tudo junto) |
| `whatsappMessage` | Mensagem padrão pré-preenchida no WhatsApp |
| `planExpress.price` / `.checkoutUrl` | Preço e link de checkout do Express |
| `planProfessional.price` / `.checkoutUrl` | Preço e link de checkout do Profissional |
| `planTurbo.price` / `.checkoutUrl` | Preço e link de checkout do Turbo |
| `faqCustomAnswers.mensalidade` | Resposta da FAQ "Tem mensalidade?" |
| `faqCustomAnswers.prazo` | Resposta da FAQ "Quanto tempo demora?" |
| `copyright` | Texto do rodapé |

A função `buildWhatsappUrl(extra)` monta o link `https://wa.me/{numero}?text={msg}` corretamente codificado.

> **Trocar WhatsApp ou preços não exige rebuild novo deploy**: você edita o `siteConfig.js`, faz `git push`, e o Vercel detecta e redesenha sozinho em ~30s.

---

## 🎨 Paleta (já configurada no `tailwind.config.js`)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-primary` | `#020402` | Fundo geral |
| `bg-secondary` | `#071107` | Seções alternadas |
| `bg-card` | `#0B140B` | Cards padrão |
| `bg-cardPremium` | `#101C10` | Cards em destaque / planos premium |
| `neon` | `#39FF14` | Verde fluorescente principal |
| `neon-secondary` | `#00FF66` | Verde neon secundário |
| `neon-dark` | `#0B3D18` | Verde escuro para fundos suaves |
| `ink-white` | `#FFFFFF` | Títulos, CTAs |
| `ink-light` | `#B8C7B8` | Texto secundário |
| `ink-dark` | `#6F7F6F` | Microcopy |

---

## 🔗 WhatsApp — como funciona

Todos os botões "Quero / Falar no WhatsApp" chamam:

```js
buildWhatsappUrl('Tenho interesse no plano Profissional')
```

Resultado:

```
https://wa.me/5543999999999?text=Ol%C3%A1%21%20Quero%20criar%20minha%20p%C3%A1gina%20profissional%20com%20WhatsApp.%0A%0ATenho%20interesse%20no%20plano%20Profissional
```

> Para mudar o número, edite `whatsappNumber` no `siteConfig.js`.

---

## 🧩 Componentes — resumo rápido

- **`TopOfferBar`** — barra superior com oferta.
- **`Header`** — sticky com blur + menu mobile (hambúrguer).
- **`HeroSection`** — headline, bullets, 2 CTAs, mockup premium do celular em CSS, notebook ao fundo.
- **`TrustStrip`** — faixa de 4 micro-diferenciais.
- **`ProblemSection`** — 4 cards com problemas do cliente.
- **`TransformationSection`** — Antes x Depois lado a lado.
- **`DeliverablesSection`** — 8 cards com o que a página entrega.
- **`SupportSection`** — 4 cards de suporte + nota honesta sobre resultados.
- **`NichesSection`** — grid de tags com 30 nichos.
- **`HowItWorksSection`** — passo a passo (5 etapas).
- **`SpecialOfferSection`** — bloco destacado com glow forte e CTA.
- **`PricingSection`** — 3 planos (Profissional em destaque).
- **`PlanComparisonSection`** — tabela comparativa responsiva.
- **`BonusSection`** — 5 bônus de lançamento + CTA.
- **`ObjectionsSection`** — 5 objeções comuns com resposta.
- **`FAQSection`** — 10 perguntas, accordion animado.
- **`FinalCTASection`** — CTA forte final.
- **`Footer`** — 3 colunas + disclaimer honesto.
- **`StickyWhatsAppButton`** — flutuante canto inferior direito com pulse halo.
- **`MobileStickyCTA`** — barra fixa inferior **só no mobile**.

---

## ✏️ Personalização rápida

| Quero… | Onde mexer |
|--------|------------|
| Trocar preços | `siteConfig.js` → `plan*.price` |
| Trocar checkout | `siteConfig.js` → `plan*.checkoutUrl` |
| Trocar número do WhatsApp | `siteConfig.js` → `whatsappNumber` |
| Trocar a marca | `siteConfig.js` → `brandName` + `<title>` no `index.html` |
| Trocar FAQ | `siteConfig.js` → `faqCustomAnswers` |
| Trocar copy das seções | Edite o `.jsx` da seção correspondente em `src/components/` |
| Trocar cores | `tailwind.config.js` → `theme.extend.colors` |
| Adicionar/remover seções | Edite `src/App.jsx` |

---

## 📈 SEO

`index.html` já vem com:

- `<title>` e `<meta description>` otimizados.
- Open Graph (og:title, og:description, og:url, og:site_name, og:type, og:locale).
- Twitter cards.
- `theme-color` preto `#020402`.
- Favicon SVG inline (zero requisições externas).
- `lang="pt-BR"` e estrutura semântica (`h1`, `h2`, `h3`, `section`, `article`).

---

## ♿ Acessibilidade

- Contraste alto (texto branco + secundário `#B8C7B8` sobre `#020402`).
- Botões com altura mínima de 44px.
- Foco visível (`focus:ring-4`).
- Suporte a `prefers-reduced-motion` (animações desligam).
- Estrutura semântica com `section`, `article`, `header`, `footer`, `main`, `nav`.

---

## 📦 Performance

- **Sem libs de UI pesadas**, **sem animações JS pesadas**.
- Animações usam `transform`/`opacity` (GPU-accelerated).
- Ícones SVG inline (zero requests extras).
- Fonte única (Inter via Google Fonts com `preconnect`).
- `build` faz code-splitting do React vendor (`manualChunks` no `vite.config.js`).
- Headers `Cache-Control: public, max-age=31536000, immutable` em tudo que tem hash.
- Total bundle gzip ≈ **70 kB** (app) + **45 kB** (React).

---

## 📝 Disclaimer (honestidade)

Os textos da página deixam claro que:

- Não prometemos vendas garantidas.
- Os resultados dependem do mercado, oferta, atendimento e tráfego.
- A página **ajuda** a organizar e apresentar melhor o negócio.

Nada de depoimentos ou números inventados.

---

© 2026 Zap Page.
