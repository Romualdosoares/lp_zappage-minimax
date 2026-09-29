# Planejamento da página de vendas — Zap Page para barbearias

Data: 28/09/2026. Status: proposta para revisão, antes da implementação.

## 1. Objetivo e decisões confirmadas

Reposicionar a página de vendas da Zap Page exclusivamente para a criação de páginas especializadas em barbearias. O público é o proprietário da barbearia que deseja apresentar seu trabalho e facilitar o contato e o agendamento.

Esta é a página comercial da Zap Page, não o site de uma barbearia específica.

- Preservar a marca Zap Page, a paleta atual e os preços existentes.
- Remodelar primeiro a página pública. O redesenho do painel administrativo fica para uma etapa posterior.
- Preservar as funções administrativas, as rotas e a integração dos benefícios dos planos.
- Incluir uma página personalizada para a bio do Instagram nos três planos.
- Incluir criativos para Meta Ads e divulgação no WhatsApp e Instagram nos planos Profissional e Turbo. Distribuição confirmada pelo usuário nesta conversa.
- Quantidades confirmadas: Profissional com 4 arquivos finais e Turbo com 10 arquivos finais, incluindo adaptações. Não multiplicar essas quantidades pelo número de formatos.
- Adotar botões mais arredondados e a direção visual **premium impactante**, conforme ajuste solicitado pelo usuário.
- Preservar as alterações já existentes em `src/AppAdmin.jsx` e `src/components/TrustStrip.jsx`.

## 2. Direções visuais consideradas

### Direção escolhida: premium impactante

Primeira dobra de presença forte: título extrapesado em escala grande, contraste intenso entre preto e verde neon e uma composição de produto que ocupa boa parte da tela. Apresentar a página de barbearia em computador e celular, com prévias da bio e dos criativos em camadas, criando profundidade sem prejudicar a leitura.

Usar iluminação verde localizada atrás das prévias, degradês escuros, contornos definidos e recortes amplos. Alternar seções escuras com blocos de destaque para dar ritmo à página. O acabamento deve transmitir especialização e valor por meio da qualidade das prévias, da hierarquia e do contraste. Efeitos reforçam os produtos e as ações, mantendo o texto legível.

Vantagem: chama atenção já na primeira dobra e torna página, bio e criativos visualmente desejáveis. Exige boas prévias, claramente identificadas como demonstração, além de controle de efeitos para preservar desempenho e usabilidade no celular.

### Alternativa: catálogo de páginas

Primeira dobra mais curta, seguida por uma galeria maior de modelos e comparação de planos. Facilita a escolha pelo estilo, mas depende de vários exemplos consistentes e pode reduzir a força da mensagem inicial.

### Alternativa: apresentação audiovisual

Vídeo como elemento central, aproveitando a estrutura atual. Pode mostrar a navegação do produto, mas precisa de conteúdo compatível com barbearias e de uma imagem estática alternativa. Tem maior custo de carregamento.

Seguir a direção premium impactante escolhida pelo usuário. As alternativas acima ficam apenas como referência. Usar vídeo apenas se a revisão do material existente comprovar relevância e qualidade para essa composição.

## 3. Sistema visual

### Paleta preservada

| Uso | Cor atual |
| --- | --- |
| Fundo principal | `#020402` |
| Fundo secundário | `#071107` |
| Superfície de cartões | `#0B140B` |
| Superfície de destaque | `#101C10` |
| Verde principal | `#39FF14` |
| Verde secundário | `#00FF66` |
| Títulos | `#FFFFFF` |
| Texto secundário | `#B8C7B8` |

### Composição e acabamento

- Manter a família de fontes do sistema nesta etapa; trabalhar peso, escala e espaçamento antes de adicionar fontes externas.
- Hero com título extrapesado à esquerda e uma composição grande de página, celular e criativos à direita no computador. Usar sobreposição e luz de fundo para criar profundidade. No celular, mensagem e CTA precedem uma composição simplificada, sem cortes no conteúdo essencial.
- Título principal com escala fluida de aproximadamente 40–56px no celular e 64–88px no computador, ajustada ao espaço disponível. Destacar uma expressão em verde e manter poucas linhas, texto secundário curto e separação clara entre seções.
- Botões principais e secundários da landing em formato de cápsula, com raio de `999px`, altura mínima de 48px e foco visível.
- Botão principal verde com texto escuro; secundário escuro com contorno legível.
- Cartões com cantos de 24–32px, contraste forte entre superfícies e contornos definidos. O plano Profissional recebe maior destaque por borda, iluminação e hierarquia, sem alterar a ordem de leitura.
- Usar luz verde localizada nas prévias e no plano em destaque, preservando fundo escuro sob os textos. Concentrar borda animada no plano em destaque e detalhe do CTA; manter o texto dos botões sem brilho que reduza sua nitidez.
- Animações curtas; respeitar movimento reduzido e evitar efeitos contínuos em todas as caixas.
- Conteúdo e ações continuam acessíveis quando a animação de entrada não executa.
- Aplicar as alterações visuais dentro de um contêiner exclusivo da landing, por exemplo `.barber-landing`.

## 4. Estrutura e conteúdo da página

| Ordem | Seção | Conteúdo e função |
| --- | --- | --- |
| 1 | Cabeçalho | Marca, links para entregas, exemplos, planos e dúvidas; CTA para WhatsApp. |
| 2 | Primeira dobra | Especialização, promessa concreta, prévia de barbearia e chamada para conhecer os planos. |
| 3 | O que sua barbearia recebe | Três entregáveis visuais: página profissional, bio personalizada e criativos nos planos elegíveis. |
| 4 | Benefícios para a rotina | Apresentar cortes e serviços, reunir horários/localização e facilitar o contato para agendamento. |
| 5 | Exemplos de páginas | Modelos de barbearia identificados como demonstrações e projetos reais do nicho quando verificados. |
| 6 | Planos | Três ofertas com preço, escopo, diferenças visíveis e contato contextualizado por plano. |
| 7 | Como funciona | Escolha e atendimento, pagamento/briefing, criação, revisões e entrega para divulgação. |
| 8 | Quem cria sua página | Apresentação breve da Zap Page e depoimentos verificados pertinentes ao nicho, quando disponíveis. |
| 9 | Dúvidas frequentes | Bio, criativos, prazo, revisões, domínio, hospedagem e funcionamento do contato/agendamento. |
| 10 | Chamada final e rodapé | Retomar o benefício central e convidar para conversar sobre a página da barbearia. |

Reduzir repetições entre problemas, benefícios, objeções e FAQ. Não reativar seções antigas apenas porque os componentes já existem.

### Texto proposto para a primeira dobra

Selo: **Criação de páginas especializada em barbearias**

Título: **Sua barbearia merece uma presença digital à altura do seu trabalho.**

Texto: Criamos uma página com a identidade da sua barbearia, serviços bem apresentados e contato pelo WhatsApp. Você também recebe uma bio personalizada para o Instagram e pode escolher um plano com criativos para divulgação.

Ação principal: **Quero a página da minha barbearia**

Ação secundária: **Ver planos**

Apoio: **Planos a partir de R$197.**

### Benefícios centrais

- **Seu trabalho bem apresentado:** cortes, barba, serviços e informações em uma página com a identidade da barbearia.
- **Uma bio com a sua marca:** microsite personalizado com os botões Contato e Agendamento.
- **Divulgação com consistência:** criativos para Meta Ads, Instagram e WhatsApp nos planos Profissional e Turbo.
- **Um caminho simples para o contato:** botões levam ao canal ou sistema de agendamento informado pelo cliente.

Não afirmar que a página inclui um sistema próprio de agenda. A integração pode direcionar ao WhatsApp ou a um sistema externo informado pelo cliente.

## 5. Oferta dos planos

Os nomes técnicos `express`, `professional` e `turbo` permanecem estáveis para preservar a integração com o painel.

| Entrega | Página Express | Página Profissional | Turbo Vendas |
| --- | --- | --- | --- |
| Preço atual à vista | R$197 | R$297 | R$497 |
| Página para barbearia | Estrutura essencial | Estrutura completa | Estrutura completa com textos aprimorados para divulgação |
| Serviços, informações e WhatsApp | Incluídos | Incluídos | Incluídos |
| Página personalizada para bio do Instagram | Incluída | Incluída | Incluída |
| Criativos para Meta Ads, WhatsApp e Instagram | Não incluídos | 4 arquivos finais | 10 arquivos finais |
| Textos para anúncios | Não incluídos | Sem promessa adicional nesta proposta | Texto principal, título e descrição |
| Revisões | 3 | 3 | 3 |
| Suporte técnico | Inicial | Incluído | Incluído |
| Suporte comercial guiado | Não previsto | 30 dias | 30 dias |
| Orientação de divulgação | Não prevista | Incluída | Incluída, com direcionamento inicial para campanha |

A bio personalizada é um microsite próprio, com a identidade da barbearia e dois botões principais: Contato e Agendamento. Não é apenas inserir a URL da página principal na bio.

Quantidade de criativos confirmada pelo usuário: Profissional com 4 arquivos finais; Turbo com 10 arquivos finais no total. Adaptações contam nesse total. Distribuição sugerida para a entrega: Profissional com 2 conceitos, cada um em Feed e Story; Turbo com 5 conceitos, cada um em Feed e Story. Essa distribuição é uma proposta operacional, não uma quantidade adicional aprovada. WhatsApp, Instagram e Meta Ads são canais de uso; uma adaptação para outro canal não triplica o volume prometido.

Manter o prazo atualmente anunciado de 3 a 5 dias após a confirmação do pagamento. Manter domínio próprio e hospedagem personalizada como contratações à parte. A hospedagem padrão segue a condição comercial já descrita no projeto.

Criativos e orientação não incluem automaticamente gestão de anúncios, publicação de campanhas ou verba de mídia. Não prometer quantidade garantida de agendamentos ou faturamento.

Substituir o selo “Mais vendido” por **“Página completa”** quando não houver evidência comercial que sustente o primeiro. Destaque visual do Profissional pode permanecer.

## 6. Integração e preservação do painel

### Benefícios editáveis

`PricingSection.jsx` consulta os benefícios do Supabase e usa os dados locais apenas como alternativa em caso de falha. Portanto, alterar apenas a lista local não implementa a nova oferta quando existem dados remotos.

Na implementação, manter a tabela e o editor atuais. Preparar a atualização revisável dos benefícios por plano para uso no gerenciador existente, preservando IDs, ordem, estado ativo e conteúdo personalizado que não esteja sendo substituído. Se for necessária uma operação em lote, preparar um procedimento pontual com cópia dos valores anteriores e reversão, sem reexecutar a carga inicial sobre dados de produção.

Dados remotos continuam sendo a fonte dos benefícios. Uma lista vazia não deve fazer reaparecer benefícios que o administrador desativou. Não acrescentar benefícios fixos fora desse fluxo para contornar o painel.

### Portfólio e depoimentos

O portfólio atual seleciona projetos marcados para a landing, mas não possui filtro de nicho nessa consulta. Não deduzir o segmento pelo nome da empresa. Revisar a seleção pelo gerenciador existente e usar apenas projetos de barbearias confirmados; na ausência deles, priorizar a demonstração de barbearia e não simular clientes reais.

Preservar `/portfolio` e as rotas de demonstração existentes. Na landing, não promover exemplos de clínicas ou restaurantes. A adequação integral do portfólio gerenciado pelo painel pertence à etapa posterior.

Depoimentos só entram como prova específica de barbearias quando sua atribuição e segmento estiverem verificados. Ausência de material não deve gerar depoimentos fictícios nem contadores inventados.

### Estilos e configurações compartilhadas

`main.jsx` carrega o CSS global para landing, painel, briefing e portfólio. Alterar regras globais de botões pode mudar o admin. Escopar raio, efeitos e composição à landing.

`siteConfig.js` também é compartilhado. Preservar marca, contato, preços e chaves; revisar consumidores antes de mudar mensagens comerciais. Manter o número atual do WhatsApp e substituir campos genéricos como `[segmento]` por contexto de barbearia.

Preservar atributos de rastreamento dos CTAs, consentimento de cookies, autenticação, permissões, CRM, financeiro, briefings e operações existentes.

## 7. Arquivos e sequência de implementação

1. **Base comercial:** revisar `src/siteConfig.js`, mensagens de WhatsApp, conteúdo de `index.html` e oferta aprovada. Preparar atualização dos benefícios remotos sem mudar o painel.
2. **Estrutura e visual:** reorganizar `src/App.jsx`, criar o escopo da landing e ajustar `src/index.css` sem alterar a paleta de `tailwind.config.js`.
3. **Primeira dobra e entregas:** remodelar `Header.jsx`, `TopOfferBar.jsx`, `HeroSection.jsx`, `DeliverablesSection.jsx` e `ProblemSection.jsx`. Revisar `TrustStrip.jsx` preservando a alteração local existente.
4. **Exemplos e oferta:** ajustar `PortfolioSection.jsx` e `PricingSection.jsx`, mantendo contratos de leitura dos dados. O comparativo estático antigo não está montado; se houver comparação, usar a mesma origem dos planos para evitar divergência.
5. **Processo e fechamento:** adequar `HowItWorksSection.jsx`, `AboutSection.jsx`, `TestimonialsSection.jsx`, `FAQSection.jsx`, `FinalCTASection.jsx`, `Footer.jsx`, `StickyWhatsAppButton.jsx` e `MobileStickyCTA.jsx`.
6. **Revisão:** verificar textos, links, conteúdo dos planos, responsividade, acessibilidade, rastreamento e ausência de regressão nas áreas existentes.

Fase seguinte, separada: planejar mudanças do painel para operação especializada em barbearias. Não redesenhar formulários ou criar novas funções administrativas nesta fase.

## 8. Critérios de aceite

- A primeira dobra comunica criação de páginas para barbearias, sem oferta genérica para vários nichos.
- A direção premium impactante aparece em títulos de grande escala, contraste forte, prévias em camadas e iluminação localizada; o celular mantém leitura clara e acesso imediato ao CTA.
- Marca e paleta permanecem reconhecíveis; botões da landing têm cantos em cápsula.
- Bio aparece nos três planos e criativos aparecem apenas nos planos aprovados.
- Preços, revisões, suporte e prazo não divergem entre seções e mensagens de WhatsApp.
- Benefícios editados, ordenados ou desativados no painel continuam refletindo na landing.
- Estados de carregamento, falha e lista vazia dos dados continuam funcionais.
- Página funciona em 360, 390, 768, 1280 e 1440px, sem rolagem horizontal ou CTAs cobrindo conteúdo/cookies.
- Navegação por teclado, foco, contraste e movimento reduzido permanecem utilizáveis.
- Links de contato, planos, demonstração e navegação levam ao destino correto.
- Rotas `/admin`, `/briefing`, `/admin/briefing/:numero` e `/portfolio` preservam funcionamento e apresentação atual.
- A compilação de produção passa; a revisão visual cobre celular e computador. Não afirmar testes autenticados sem acesso real.
- Nenhuma publicação é feita como parte da etapa de planejamento.

## 9. Revisão do planejamento

Objetivo, público, paleta, distribuição dos novos benefícios, quantidades de arquivos finais e fronteira com o admin estão definidos. A direção visual foi ajustada para **premium impactante** a pedido do usuário. Esta revisão atualiza o planejamento; a implementação continua sendo a etapa seguinte do fluxo de revisão do Superpowers solicitado.

Análise complementar: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.html` e `graphify-out/graph.json`. O Graphify analisou 37 arquivos de código de `src/` e `api/`, produzindo 257 nós e 557 relações consolidadas. O mapa auxilia a revisão das dependências; não substitui testes funcionais ou validação de dados remotos.
