# Renovação de sessão administrativa

## Objetivo

Manter a sessão autenticada do painel administrativo válida durante seu uso para que a edição, inclusão, ativação e exclusão de benefícios dos planos não falhem com `JWT expired` depois da expiração do token de acesso.

## Causa confirmada

`src/lib/supabaseClient.js` grava a resposta do login no `localStorage`, mas as requisições REST e de Storage reutilizam o `access_token` gravado sem renová-lo. Como o cliente autenticado próprio não está configurado para renovação automática, um token expirado é enviado ao Supabase e operações que exigem permissão de administrador são rejeitadas.

## Escopo

- Criar uma camada pequena e testável para ler, validar e renovar a sessão persistida.
- Antes de uma chamada autenticada, renovar o token quando ele estiver expirado ou próximo da expiração.
- Em resposta de autenticação expirada, renovar uma única vez e repetir a chamada protegida.
- Reutilizar a mesma renovação em andamento para chamadas simultâneas do carregamento administrativo.
- Aplicar token renovado às chamadas REST e de Storage que usam a sessão.
- Se a renovação falhar, remover a sessão local e exibir o erro de login, sem repetir a chamada indefinidamente.
- Adicionar testes automatizados para expiração, renovação bem-sucedida, falha de renovação e deduplicação de chamadas simultâneas.

## Fora de escopo

- Alterar políticas RLS, tabela `plan_benefits` ou migrações do Supabase.
- Migrar todo o projeto para o SDK Supabase.
- Alterar os conteúdos ou a interface dos planos.

## Arquitetura

Um módulo de sessão centralizará o armazenamento, a leitura do `exp` do JWT e a chamada `POST /auth/v1/token?grant_type=refresh_token`. A função retornará sessão válida ou lançará erro de autenticação. Uma única promessa em memória evitará que carregamentos paralelos façam várias renovações com o mesmo `refresh_token`.

`restRequest` obterá o token por essa camada para chamadas autenticadas. Quando Supabase devolver erro de token expirado, fará apenas uma nova tentativa após renovar a sessão. Uploads e geração de URL assinada usarão a mesma função antes de montar seus cabeçalhos.

Chamadas públicas continuarão usando a chave anônima e não tentarão renovar sessão.

## Tratamento de erros

- Sem `refresh_token`: limpar sessão e retornar mensagem de login necessário.
- Refresh inválido, revogado ou indisponível: limpar sessão e propagar erro retornado pelo Supabase.
- Token expirado após a repetição: propagar erro; nenhuma terceira tentativa será feita.
- Falha de rede no refresh: preservar mensagem de rede do Supabase e não mascarar como sucesso.

## Critérios de aceitação

1. Uma sessão expirada com `refresh_token` válido recebe novo `access_token` e a edição de benefício prossegue.
2. Várias operações que começam com a mesma sessão expirada compartilham uma única chamada de refresh.
3. Uma resposta `JWT expired` dispara, no máximo, um refresh e uma repetição da requisição.
4. Falha de refresh remove a sessão local e informa que é necessário entrar novamente.
5. Chamadas públicas continuam autenticadas somente com a chave anônima.
6. Testes de regressão e build do projeto passam.
