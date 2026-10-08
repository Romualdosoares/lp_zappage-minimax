# Valores dos planos

Na aba Planos, o administrador edita o preço à vista de Express, Profissional e Turbo. O parcelamento é em até 10 vezes sem juros. O cálculo utiliza centavos inteiros, ajustando a última parcela para preservar o valor total.

Os preços são persistidos na tabela existente public.portfolio_services, nos registros exclusivos plan-pricing-express, plan-pricing-professional e plan-pricing-turbo. Esses registros não aparecem no catálogo de serviços. As permissões existentes permitem leitura dos valores ativos e escrita apenas por administradores. Não é necessária migração. Quando ainda não há registro, usam-se R$ 197,00, R$ 297,00 e R$ 497,00. A gravação inicial ocorre ao salvar um valor alterado.

A principal e a V2 usam a mesma fonte, incluindo preços nos links do WhatsApp e chamadas de valor inicial. Atualizações entre abas usam BroadcastChannel. Entre dispositivos usam Realtime quando habilitado, com consulta a cada 30 segundos, ao retomar o foco e ao recuperar a conexão. O último preço confirmado permanece visível durante falhas de rede.

Validação: valores entre R$ 1,00 e R$ 1.000.000,00, com até duas casas decimais. O parcelamento não é editado separadamente para evitar divergência com o preço total.
