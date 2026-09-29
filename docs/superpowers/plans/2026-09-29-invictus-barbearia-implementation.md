# Invictus Barbearia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar duas versões estáticas do site da Invictus, com dados confirmados e agendamento inativo até receber URL.

**Architecture:** Criar entrega isolada em `output/invictus-barbearia/`. Cada versão inclui HTML, CSS, JavaScript e logo local. Comparador usa iframes. Script Node valida contrato antes dos ZIPs.

**Tech Stack:** HTML5, CSS3, JavaScript sem dependências, Node.js e PowerShell.

---

## Arquivos

- Criar: `output/invictus-barbearia/assets/invictus-logo.jpg`
- Criar: `output/invictus-barbearia/versao-1/{index.html,assets/styles.css,assets/app.js}`
- Criar: `output/invictus-barbearia/versao-2/{index.html,assets/styles.css,assets/app.js}`
- Criar: `output/invictus-barbearia/{comparar.html,CHECKLIST-PUBLICACAO.md,LEIA-ME-HOSPEDAGEM.md,fontes-e-pendencias.md,verificar-entrega.mjs}`

### Task 1: Criar estrutura e contrato da versão Império Obsidiana

**Files:**
- Create: `output/invictus-barbearia/assets/invictus-logo.jpg`
- Create: `output/invictus-barbearia/versao-1/index.html`
- Create: `output/invictus-barbearia/versao-1/assets/styles.css`
- Create: `output/invictus-barbearia/versao-1/assets/app.js`
- Create: `output/invictus-barbearia/verificar-entrega.mjs`

- [ ] **Step 1: Copiar logo autorizado e criar diretórios**

~~~powershell
New-Item -ItemType Directory -Force output/invictus-barbearia/assets, output/invictus-barbearia/versao-1/assets
Copy-Item -LiteralPath 'C:\Users\Romualdo\Desktop\824531306_17971937760132830_5146426651579558558_n.jpg' -Destination output/invictus-barbearia/assets/invictus-logo.jpg
~~~

- [ ] **Step 2: Escrever verificador inicialmente falho**

~~~js
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve('output/invictus-barbearia')
for (const file of ['versao-1/index.html', 'versao-1/assets/styles.css', 'versao-1/assets/app.js']) {
  if (!existsSync(resolve(root, file))) throw new Error('Ausente: ' + file)
}
const html = readFileSync(resolve(root, 'versao-1/index.html'), 'utf8')
for (const text of ['Invictus Barbearia', 'Agendamento em breve', 'aria-disabled="true"', 'instagram.com/invictusbarberlondrina', 'maps.app.goo.gl/3PSayjcvByZZUtjw7']) {
  if (!html.includes(text)) throw new Error('Requisito ausente: ' + text)
}
console.log('Contrato aprovado.')
~~~

- [ ] **Step 3: Rodar teste para confirmar falha**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Error: Ausente: versao-1/index.html`.

- [ ] **Step 4: Construir HTML e comportamento mínimo**

Hero usa logo local, marca, proposta sem promessas verificáveis, navegação por âncora e CTA desativado. Seções: manifesto, experiência, conexões e rodapé. Usar somente Instagram e Maps fornecidos. Excluir endereço, telefone, horário, preço, equipe, serviços específicos e avaliações.

~~~js
const bookingUrl = ''
document.querySelectorAll('[data-booking]').forEach((button) => {
  button.setAttribute('aria-disabled', String(!bookingUrl))
  button.addEventListener('click', (event) => { if (!bookingUrl) event.preventDefault() })
  if (bookingUrl) button.href = bookingUrl
})
~~~

- [ ] **Step 5: Estilizar Obsidiana**

~~~css
:root { --ink:#050505; --gold:#d4a73a; --bronze:#8c5a1d; --ivory:#f5e7c8; }
.booking[aria-disabled="true"] { cursor:not-allowed; opacity:.58; filter:grayscale(.32); }
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; } }
~~~

Complete com composição assimétrica, borda dourada móvel em um cartão, foco visível, controles de 44px e breakpoints sem rolagem horizontal. Observer pode adicionar `.is-visible`, mas conteúdo inicia visível sem JavaScript.

- [ ] **Step 6: Rodar teste e commit**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Contrato aprovado.`

~~~bash
git add output/invictus-barbearia
git commit -m "feat: add Invictus Obsidiana site"
~~~

### Task 2: Construir Herança do Barbeiro como alternativa real

**Files:**
- Create: `output/invictus-barbearia/versao-2/index.html`
- Create: `output/invictus-barbearia/versao-2/assets/styles.css`
- Create: `output/invictus-barbearia/versao-2/assets/app.js`
- Modify: `output/invictus-barbearia/verificar-entrega.mjs`

- [ ] **Step 1: Escrever teste inicialmente falho para versão 2**

~~~js
for (const file of ['versao-2/index.html', 'versao-2/assets/styles.css', 'versao-2/assets/app.js']) {
  if (!existsSync(resolve(root, file))) throw new Error('Ausente: ' + file)
}
const v2 = readFileSync(resolve(root, 'versao-2/index.html'), 'utf8')
const v2Css = readFileSync(resolve(root, 'versao-2/assets/styles.css'), 'utf8')
if (!v2.includes('Agendamento em breve') || !v2Css.includes('--paper')) throw new Error('Contrato editorial ausente')
~~~

- [ ] **Step 2: Rodar teste para confirmar falha**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Error: Ausente: versao-2/index.html`.

- [ ] **Step 3: Implementar versão editorial**

Preservar conteúdo e URLs da versão 1. Trocar composição: fundo marfim, blocos pretos, grade de revista, molduras e linhas horizontais. Manter CTA inativo com mesma configuração única.

~~~css
:root { --paper:#efe3c8; --ink:#16120d; --gold:#a87520; --black:#080705; }
.editorial-card::before { content:""; background:linear-gradient(90deg,var(--gold),transparent,var(--gold)); }
~~~

- [ ] **Step 4: Rodar teste e commit**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Contrato aprovado.` sem erros.

~~~bash
git add output/invictus-barbearia
git commit -m "feat: add Invictus editorial alternative"
~~~

### Task 3: Criar comparador, instruções e pacotes

**Files:**
- Create: `output/invictus-barbearia/comparar.html`
- Create: `output/invictus-barbearia/CHECKLIST-PUBLICACAO.md`
- Create: `output/invictus-barbearia/LEIA-ME-HOSPEDAGEM.md`
- Create: `output/invictus-barbearia/fontes-e-pendencias.md`
- Modify: `output/invictus-barbearia/verificar-entrega.mjs`

- [ ] **Step 1: Estender teste para comparador e documentos**

~~~js
for (const file of ['comparar.html','CHECKLIST-PUBLICACAO.md','LEIA-ME-HOSPEDAGEM.md','fontes-e-pendencias.md']) {
  if (!existsSync(resolve(root, file))) throw new Error('Ausente: ' + file)
}
const compare = readFileSync(resolve(root, 'comparar.html'), 'utf8')
if (!compare.includes('versao-1/index.html') || !compare.includes('versao-2/index.html')) throw new Error('Prévias ausentes')
~~~

- [ ] **Step 2: Rodar teste para confirmar falha**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Error: Ausente: comparar.html`.

- [ ] **Step 3: Criar comparador responsivo**

Dois iframes lado a lado, controles “Celular” e “Computador” que mudam ambos, links para abrir versões e downloads independentes. Em tela estreita, cartões mantêm largura mínima de 320px e rolagem horizontal.

- [ ] **Step 4: Criar instruções e fontes**

`LEIA-ME-HOSPEDAGEM.md` ensina alterar somente `const bookingUrl = ''`, inserir URL `https://` ou `http://`, gerar ZIP e enviar conteúdo à raiz pública. Checklist cobre SEO local, endereço, telefone, horários, acessibilidade, movimento e links. Fontes registram logo do cliente, Instagram/Maps, data de consulta, paleta derivada e pendências.

- [ ] **Step 5: Rodar teste e criar ZIPs**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: `Contrato aprovado.`

~~~powershell
Compress-Archive -Path output/invictus-barbearia/versao-1/* -DestinationPath output/invictus-barbearia/versao-1-hospedagem.zip -Force
Compress-Archive -Path output/invictus-barbearia/versao-2/* -DestinationPath output/invictus-barbearia/versao-2-hospedagem.zip -Force
~~~

- [ ] **Step 6: Commit**

~~~bash
git add output/invictus-barbearia
git commit -m "docs: package Invictus delivery"
~~~

### Task 4: Validar visualmente e testar ZIPs

**Files:**
- Create: `output/invictus-barbearia/qa/browser-report.json`
- Create: `output/invictus-barbearia/qa/desktop-*.png`
- Create: `output/invictus-barbearia/qa/mobile-*.png`

- [ ] **Step 1: Executar verificador final**

Run: `node output/invictus-barbearia/verificar-entrega.mjs`

Expected: sucesso sem exceções.

- [ ] **Step 2: Abrir ambos os sites em 1440px e 390px**

Validar hero, seções, foco, ausência de overflow, movimento reduzido, Instagram, Maps e CTA inativo. Salvar capturas e relatório.

- [ ] **Step 3: Testar ZIPs extraídos**

~~~powershell
Expand-Archive -LiteralPath output/invictus-barbearia/versao-1-hospedagem.zip -DestinationPath $env:TEMP/invictus-v1-test -Force
Expand-Archive -LiteralPath output/invictus-barbearia/versao-2-hospedagem.zip -DestinationPath $env:TEMP/invictus-v2-test -Force
Test-Path $env:TEMP/invictus-v1-test/index.html
Test-Path $env:TEMP/invictus-v2-test/index.html
~~~

Expected: dois resultados `True`.

- [ ] **Step 4: Commit final**

~~~bash
git add output/invictus-barbearia
git commit -m "test: verify Invictus site delivery"
~~~
