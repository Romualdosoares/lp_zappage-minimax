# Página para barbearias — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Execute as tarefas e registre as verificações.

**Goal:** Implementar a página de vendas especializada em barbearias com visual premium impactante aprovado.

**Architecture:** Preservar React, roteamento e contratos Supabase. Isolar estilos em `.barber-landing`; manter benefícios remotos como fonte editável e defaults coerentes para falha de rede. Não alterar arquivos do painel.

**Tech Stack:** React 18, Vite, Tailwind CSS, Supabase.

## Tarefas

- [ ] 1. Atualizar copy dos componentes públicos secundários, mensagens WhatsApp e metadados. Preservar número, preços, nomes e chaves dos planos. Revisar bio nos três planos, 4 arquivos no Profissional, 10 no Turbo, 3 revisões e suporte existente. Arquivos: `src/siteConfig.js`, `index.html`, `src/components/{Header,TopOfferBar,ProblemSection,HowItWorksSection,AboutSection,FAQSection,FinalCTASection,Footer,StickyWhatsAppButton,MobileStickyCTA}.jsx`.
- [ ] 2. Criar primeira dobra e vitrine de produtos com prévias originais em HTML/CSS: página, bio e criativos. Escopar estilos da composição e botões arredondados em `src/index.css`. Arquivos: `src/components/{HeroSection,DeliverablesSection,PortfolioSection}.jsx`, novo `BarberShowcase.jsx`, `src/App.jsx`. Usar demonstrações claramente identificadas; não atribuir clientes fictícios à empresa.
- [ ] 3. Atualizar apresentação e defaults em `src/components/PricingSection.jsx`; manter leitura, realtime, polling, estados de vazio e falha. Preparar migração revisável de dados em `supabase/migrations/` com preservação de benefícios personalizados e estado ativo. Não executar cargas iniciais nem alterar editor administrativo.
- [ ] 4. Revisar correspondência entre especificação e implementação com agente. Corrigir divergências antes da revisão de qualidade. Verificar diff do admin e preservar mudanças prévias.
- [ ] 5. Executar `npm run build` (esperado: código de saída 0). Inspecionar navegador em desktop e celular, links, menu, foco, ausência de overflow, movimento reduzido, dados carregados/vazios/falhos. Verificar `/admin`, `/briefing`, `/portfolio` e demo existente sem modificar registros reais.
- [ ] 6. Entregar prévia e registrar limites reais: publicação e qualquer migração remota não executadas devem ser explicitadas. Não confundir compilação com testes autenticados.

## Verificação proporcional

Textos e estilos são alterações reversíveis, verificadas por compilação e inspeção visual, sem testes que apenas espelhem implementação. Novas transformações de dados, se necessárias, exigem testes de comportamento. CSS público usa `.barber-landing .btn-primary { border-radius: 999px; min-height: 48px; }` e equivalente secundário, preservando utilitários do admin.

## Condições de entrega

Sem promessas de resultado, prova social inventada, alteração do admin ou publicação automática. Quantidades aprovadas são arquivos finais incluindo adaptações. O agendamento é um destino externo informado pelo cliente, não sistema próprio incluído.
