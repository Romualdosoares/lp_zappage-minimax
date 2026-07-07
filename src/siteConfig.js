// =============================================================
//  Zap Page - Configuração global editável
//  Centralize aqui TODAS as informações que mudam com frequência:
//  preços, links de checkout, número do WhatsApp, mensagens,
//  marca, contatos e copy principal.
// =============================================================

export const siteConfig = {
  // --------- Identidade ---------
  brandName: 'Zap Page',
  logoSrc: '/assets/zap-page-logo-256.png',
  shareImageSrc: '/assets/zap-page-logo-512.png',
  tagline: 'Páginas profissionais com WhatsApp para negócios locais',
  domain: 'https://zappage.com.br',

  // --------- Contato / WhatsApp ---------
  whatsappNumber: '5543991229181', // DDI + DDD + número
  whatsappMessage:
    'Olá! Quero criar minha página profissional com WhatsApp.',

  // --------- Planos ---------
  planExpress: {
    name: 'Página Express',
    badge: 'Entrada rápida',
    price: 'R$197',
    description:
      'Para quem precisa de uma página simples, bonita e direta para começar a divulgar.',
    checkoutUrl: '#',
  },
  planProfessional: {
    name: 'Página Profissional',
    badge: 'Mais vendido',
    price: 'R$297',
    description:
      'Para quem quer uma página mais completa, com textos persuasivos e orientação para usar a estrutura da forma correta.',
    checkoutUrl: '#',
  },
  planTurbo: {
    name: 'Turbo Vendas',
    badge: 'Melhor para anunciar',
    price: 'R$497',
    description:
      'Para quem quer página, copy, criativos e orientação inicial para divulgar com mais força.',
    checkoutUrl: '#',
  },

  // --------- Rodapé / institucional ---------
  copyright: '© 2026 Zap Page. Todos os direitos reservados.',

  // --------- FAQ – respostas dinâmicas (se preferir customizar) ---------
  faqCustomAnswers: {
    mensalidade:
      'Não há mensalidade no valor da criação. Caso exista custo de domínio, hospedagem ou manutenção futura, isso será combinado separadamente.',
    prazo:
      'O prazo depende do plano e da fila de produção. Após recebermos todas as informações, informamos o prazo exato de entrega.',
  },
}

// ----------------------------
// Helpers para gerar URL do WhatsApp
// ----------------------------
export function buildWhatsappUrl(extraMessage = '') {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`
  const message = encodeURIComponent(
    extraMessage?.trim()
      ? `${siteConfig.whatsappMessage}\n\n${extraMessage}`
      : siteConfig.whatsappMessage,
  )
  return `${base}?text=${message}`
}

export const checkoutLinks = {
  express: siteConfig.planExpress.checkoutUrl,
  professional: siteConfig.planProfessional.checkoutUrl,
  turbo: siteConfig.planTurbo.checkoutUrl,
}
