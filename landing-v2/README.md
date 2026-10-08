# Zap Page — landing page B

Página de vendas alternativa para donos de barbearia. A versão A permanece na raiz do projeto. A versão B usa a mesma marca, a mesma paleta e os mesmos preços administrados na aba Planos da versão A, com atualização automática e parcelamento em até 10x sem juros.

## Publicação estática

O ZIP original entregue contém `index.html`, `styles.css` e a pasta `assets/`. Extraia tudo na raiz de uma hospedagem de sites estáticos. O `index.html` deve ficar na raiz. Também é possível abrir o arquivo diretamente no navegador, sem servidor local.

No projeto Vite da Zap Page, a prévia local está em `/landing-v2/`. O projeto Vercel foi configurado para servir a versão B em `/v2` quando uma publicação futura for solicitada. A versão integrada ao projeto usa preços dinâmicos e precisa ser gerada com npm run build; o ZIP original é uma entrega estática anterior.

## Ajustes de conteúdo

- O link do WhatsApp é configurado no `href` do botão final `Conversar no WhatsApp`, em `index.html`. Todos os outros botões de contato usam esse mesmo endereço quando o JavaScript está ativo; sem JavaScript, levam ao botão final.
- Preços e benefícios estão no bloco `#planos` em `index.html`. Se forem alterados no painel admin da versão A, atualize esta página para manter o teste A/B comparável. A versão estática não lê o painel.
- O endereço da versão B pode receber parâmetros UTM em uma campanha de teste. No projeto principal, os eventos são enviados à API existente com `source: landing-v2`. Em hospedagem estática independente, a página funciona, mas o registro de eventos depende de conectar um endpoint de análise.
- Não há avaliações, endereço, mapa ou horário de uma barbearia porque a Zap Page vende a criação de páginas; nenhum desses dados foi fornecido ou verificado.
- Não há promessa de sistema de agendamento incluído. O site pode apontar para um sistema que o cliente já utilize.

## Imagens

Fotografias de banco com uso comercial permitido pela licença da Pexels, usadas apenas como referência visual. Não representam instalações, profissionais, clientes ou trabalhos reais da Zap Page. Ao produzir a página de cada barbearia, substitua por fotos autorizadas pelo negócio.

- `scissors.webp`: Matheus Wladeka — https://www.pexels.com/photo/person-having-haircut-in-close-up-photography-6487890/
- `fade-detail.webp`: izzet çakallı — https://www.pexels.com/photo/a-barber-using-a-razor-blade-12464841/
- `chair.webp`: MaGicA Production — https://www.pexels.com/photo/vintage-style-barber-chair-in-modern-barbershop-30547746/
- `beard-detail.webp`: Gustavo Fring — https://www.pexels.com/photo/close-up-of-shaving-beard-7447140/
- Licença: https://www.pexels.com/license/

O logo veio dos ativos já existentes da Zap Page neste projeto.
