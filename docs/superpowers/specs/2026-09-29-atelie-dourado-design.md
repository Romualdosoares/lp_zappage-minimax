# Direção visual Ateliê Dourado

## Objetivo

Substituir a aparência verde e os mockups artificiais da landing por uma direção fotográfica premium para barbearias, sem alterar preços, benefícios, WhatsApp, rastreamento ou painel administrativo.

## Direção aprovada

Ateliê dourado: fotografia cinematográfica com ferramentas, couro, metal, madeira escura e cenas de trabalho. A referência `hero-dark.webp` orienta composição, contraste e textura. Nenhuma imagem representa cliente, equipe ou espaço real da Zap Page.

### Paleta pública

- Preto carvão: `#070604`
- Preto de superfície: `#100D09`
- Dourado envelhecido: `#C6A15B`
- Dourado claro: `#E2C47F`
- Marfim: `#F3EBDD`
- Texto secundário: `#B9B0A1`

As novas cores ficam sob `.barber-landing`. Painel, briefing, portfólio administrativo e demonstrações preservam tokens existentes.

## Imagens

1. Hero original gerado a partir da referência: ferramentas sobre pedra preta, luz dourada, objetos à direita e espaço negativo à esquerda.
2. Imagem de cadeira/interior: couro preto, metal dourado e luz baixa, sem marca reconhecível.
3. Imagem de trabalho: mãos de barbeiro em ação, enquadramento fechado e sem rosto identificável.

Imagens sem texto, logotipos ou marca d'água. Salvar versões finais em `public/assets/barbershop/`, otimizadas em WebP. Registrar geração e fontes de pesquisa em `docs/fontes-imagens-barbearia.md`.

## Estrutura

- Hero: fotografia em largura total, texto no lado esquerdo, degradê escuro para leitura e CTA dourado.
- Entregas: remover `BarberShowcase` e prévias de navegador/celular. Usar três blocos editoriais: página para barbearia, bio personalizada e criativos, cada um acompanhado por fotografia.
- Benefícios: usar recorte da cena de trabalho como faixa visual entre conteúdo e problemas.
- Demonstração: manter link real `/demonstracoes/barbearia`, mas trocar preview artificial por fotografia de interior e texto explícito de demonstração.
- Planos, processo, FAQ e CTA: superfícies negras, filetes dourados e tipografia marfim. Borda animada somente no plano Profissional e com movimento lento.

## Critérios

- Nenhum mockup de dispositivo, navegador ou arte publicitária na landing.
- Nenhum verde neon visível dentro de `.barber-landing`.
- Imagens com `alt` adequado, dimensões, `loading` e `decoding` definidos.
- Hero mantém texto legível em 360, 390, 768, 1280 e 1440 px.
- Sem rolagem horizontal; botões mantêm raio de cápsula e área mínima de 48 px.
- `prefers-reduced-motion` mantém tudo visível.
- Rotas e estilos do painel permanecem isolados.
