# Invictus Barbearia — design do site premium

## Objetivo

Entregar duas versões estáticas, prontas para hospedagem, da presença comercial da Invictus Barbearia em Londrina. A versão principal selecionada é **Império Obsidiana**. A segunda versão permite comparação antes da escolha final de publicação.

## Dados confirmados

- Marca: Invictus Barbearia.
- Instagram: https://www.instagram.com/invictusbarberlondrina/
- Mapa informado pelo cliente: https://maps.app.goo.gl/3PSayjcvByZZUtjw7
- Logo: arquivo fornecido no briefing; escudo, elmo e navalha em fundo preto.
- Paleta derivada do logo: preto `#050505`, dourado `#D4A73A`, bronze `#8C5A1D`, marfim `#F5E7C8`.
- Agendamento: ainda sem destino. Todos os CTAs ficam desativados com rótulo “Agendamento em breve”.

## Dados ausentes

Não mostrar endereço em texto, telefone, WhatsApp, horário, preços, profissionais, fotos do espaço, avaliações, serviços específicos ou números de reputação. O Google Maps e Instagram não puderam ser consultados no momento; resultados de busca trazem homônimos e não são fonte segura para esses campos.

## Direções visuais

### Versão 1 — Império Obsidiana

Direção principal escolhida pelo cliente. Fundo preto profundo, dourado metálico, composição assimétrica e linhas finas de precisão. O brasão domina a primeira dobra. Tipografia de presença, cartões com borda dourada animada e um tratamento de luz contido criam percepção de disciplina e excelência.

### Versão 2 — Herança do Barbeiro

Alternativa para comparação. Fundo marfim escuro, blocos pretos e dourado envelhecido. Estrutura mais editorial, molduras clássicas e ritmo de leitura mais calmo. Mantém mesma marca, Instagram, mapa e estado de agendamento.

## Estrutura de cada versão

1. Hero: logo, título “Invictus Barbearia”, proposta sem alegação não verificável e CTA desativado.
2. Manifesto: texto de apresentação centrado em cuidado, estilo e precisão, sem promessas mensuráveis.
3. Experiência: três pilares genéricos de atendimento masculino, sem alegar serviços não confirmados.
4. Conexões: Instagram funcional, mapa pelo link fornecido e CTA de agendamento desativado.
5. Rodapé: marca e aviso de agendamento em breve.

## Implementação e acessibilidade

Arquivos estáticos, sem build para funcionamento: `index.html`, CSS, JavaScript mínimo e imagem de logo local. O HTML contém título, descrição e dados estruturados limitados ao nome e Instagram confirmados. Botões terão estados de foco, hover, pressionado e desativado. Transições respeitam `prefers-reduced-motion`; o conteúdo fica visível sem JavaScript. Nenhum formulário ou link de contato sem destino será exibido.

## Entrega

`output/invictus-barbearia/` terá `comparar.html`, duas pastas independentes, dois ZIPs de hospedagem, checklist de publicação, instruções de hospedagem e fontes/pendências. A comparação alterna entre celular e desktop e mostra a versão principal primeiro.

## Critérios de aceite

- As duas versões são visualmente distintas e preservam marca e dados confirmados.
- Sem endereço, telefone, horário, preço, avaliação ou foto não confirmados.
- Todo CTA de agendamento permanece claramente desativado até URL fornecida.
- Instagram e rota do mapa usam os URLs fornecidos.
- Cada ZIP abre com `index.html` na raiz e sem dependências externas necessárias para layout ou logo.
