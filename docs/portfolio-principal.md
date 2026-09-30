# Portfólio na página principal

## Logo ou prévia em cada trabalho

No formulário de cada trabalho, use **Imagem do projeto**: envie uma imagem PNG, JPG ou WebP de até 5 MB, ou cole um link público de imagem. Escolha **Logo** para preservar a imagem inteira ou **Prévia do site** para mostrar o topo de uma captura. Confira a prévia e salve. A imagem aparece tanto na página principal quanto em `/portfolio`.

Sem imagem personalizada, o card tenta carregar `/favicon.ico` do domínio do cliente. Se a imagem não estiver disponível, mostra as iniciais da empresa, sem ícone quebrado. O botão **Remover imagem personalizada** restaura esse comportamento após salvar. Imagens enviadas são públicas; remover a associação não exclui o arquivo do armazenamento.

Antes de publicar essa funcionalidade, aplique `supabase/migrations/20260930010000_portfolio_images.sql`. Ela acrescenta `image_url` e `image_kind` e cria o bucket público `portfolio-images`, com escrita restrita a administradores e limite de formato/tamanho. A migração anterior de Realtime continua necessária para atualização instantânea entre dispositivos. Nenhum arquivo de cliente existente é alterado.

Em **Admin → Portfólio**, publique o trabalho, marque **Exibir na seção Portfólio da página principal** e salve. Até seis trabalhos publicados aparecem em `/#portfolio`. Para substituir um trabalho quando as seis vagas estiverem ocupadas, desmarque um deles e salve antes de selecionar o próximo. Despublicar também remove a seleção.

Itens com **Mostrar primeiro na lista** aparecem antes dos demais; depois, a ordem é do cadastro mais recente. O portfólio completo em `/portfolio` continua exibindo todos os trabalhos publicados.

## Ativar atualização instantânea entre dispositivos

Aplicar `supabase/migrations/20260930000000_portfolio_realtime.sql` no projeto Supabase usado pelo site. O arquivo é transacional e pode ser executado novamente. O schema consolidado também inclui essa estrutura para novas instalações.

A migração cria `portfolio_revision`, com uma única revisão numérica pública, e um gatilho que incrementa a revisão após inclusão, edição ou remoção em `client_sites`. A tabela de revisão entra na publicação `supabase_realtime`. Visitantes recebem o aviso e consultam novamente apenas os trabalhos publicados e selecionados. Nenhum conteúdo de trabalhos ocultos é enviado no aviso. As permissões existentes de `client_sites` são preservadas.

Abas do mesmo navegador também sincronizam por BroadcastChannel. Na falta do Realtime, a página consulta novamente a cada 30 segundos enquanto visível, ao recuperar foco ou conexão. A inscrição começa quando a seção se aproxima da área visível. Falhas preservam a última lista carregada e oferecem nova tentativa.

## Validação

`node --test tests/portfolioFeed.test.js` verifica seleção, limite, URLs seguras, mudanças em tempo real, respostas fora de ordem e limpeza da inscrição. `npm run build` valida a compilação.

`node tests/portfolio.browser.mjs` testa a página e o admin com dados simulados e todo tráfego externo interceptado. Requer Playwright e Chrome, além do servidor local em `http://127.0.0.1:5174` (ou `TEST_BASE_URL`). Se Playwright não estiver instalado no projeto, `PLAYWRIGHT_MODULE` pode apontar para a URL `file:///.../playwright/index.mjs` do runtime disponível. Os testes cobrem criação, edição, remoção, despublicação, limite de seleção, sincronização entre abas, erros e recuperação, desktop e celular. Capturas ficam em `output/portfolio-qa/`.

Depois de aplicar a migração e publicar o código: abrir a página principal em outro dispositivo, selecionar e salvar um trabalho no admin; confirmar a atualização sem recarregar. Repetir com edição, desmarcação, despublicação e remoção. A aplicação da migração e essa verificação remota dependem do acesso ao Supabase.
