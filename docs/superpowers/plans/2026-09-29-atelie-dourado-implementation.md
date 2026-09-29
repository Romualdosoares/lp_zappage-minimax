# Ateliê Dourado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a landing de barbearias em uma experiência fotográfica preto/dourado e remover todos os mockups artificiais.

**Architecture:** Manter componentes React e integrações atuais. Adicionar três imagens locais otimizadas e aplicar o novo sistema visual somente sob `.barber-landing`; o admin continua usando os tokens existentes.

**Tech Stack:** React 18, Vite, Tailwind CSS, CSS, ImageGen, WebP.

---

### Task 1: Gerar e preparar imagens

**Files:**
- Create: `public/assets/barbershop/hero-atelier-gold.webp`
- Create: `public/assets/barbershop/chair-atelier-gold.webp`
- Create: `public/assets/barbershop/craft-atelier-gold.webp`
- Create: `docs/fontes-imagens-barbearia.md`

- [ ] Gerar hero 16:9 a partir da referência, com espaço negativo à esquerda.
- [ ] Gerar interior/cadeira em composição horizontal.
- [ ] Gerar cena de trabalho fechada sem rosto identificável.
- [ ] Inspecionar cada imagem e converter para WebP com qualidade visual adequada.
- [ ] Registrar prompts, ferramenta e referências de pesquisa.

### Task 2: Substituir mockups por fotografia

**Files:**
- Modify: `src/components/HeroSection.jsx`
- Modify: `src/components/DeliverablesSection.jsx`
- Modify: `src/components/PortfolioSection.jsx`
- Delete: `src/components/BarberShowcase.jsx`

- [ ] Aplicar hero fotográfico com overlay responsivo e CTA existente.
- [ ] Criar três blocos editoriais com imagens reais/geradas e textos aprovados.
- [ ] Trocar preview de demonstração por fotografia e manter link/tracking.
- [ ] Confirmar que nenhum import ou seletor depende de `BarberShowcase`.

### Task 3: Aplicar preto e dourado apenas à landing

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] Definir tokens dourados dentro de `.barber-landing` e sobrescrever utilitários visíveis usados pelos componentes públicos.
- [ ] Remover seletores dos mockups e adicionar layouts fotográficos responsivos.
- [ ] Atualizar `theme-color` para preto carvão.
- [ ] Preservar estilos das rotas sem `.barber-landing`.

### Task 4: Verificar

**Files:**
- Update: `docs/qa/browser-report.json`
- Create: `docs/qa/gold-desktop-hero.png`
- Create: `docs/qa/gold-mobile-hero.png`
- Create: `docs/qa/gold-desktop-sections.png`

- [ ] Executar `npm run build`; esperado código 0.
- [ ] Renderizar 360, 390, 768, 1280 e 1440 px; confirmar largura do documento igual à viewport.
- [ ] Confirmar ausência de mockups, verde visível e erros do navegador.
- [ ] Conferir menu, FAQ, WhatsApp, estados de benefícios e rotas administrativas.
- [ ] Revisar diff com foco em isolamento do admin e conteúdo real.
