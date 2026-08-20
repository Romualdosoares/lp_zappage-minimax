// =============================================================
//  Zap Page - Configuração global editável
//  Centralize aqui TODAS as informações que mudam com frequência:
//  preços, número do WhatsApp, mensagens,
//  marca, contatos e copy principal.
// =============================================================

export const siteConfig = {
  // --------- Identidade ---------
  brandName: 'Zap Page',
  logoSrc: '/assets/zap-page-logo-256.png',
  shareImageSrc: '/assets/zap-page-logo-512.png',
  tagline: 'Páginas profissionais com WhatsApp para negócios locais',
  // VITE_SITE_URL permite sobrescrever o domínio em ambientes de preview.
  domain: import.meta.env.VITE_SITE_URL || 'https://www.zappagepro.com.br',

  // --------- Contato / WhatsApp ---------
  whatsappNumber: '5543991229181', // DDI + DDD + número
  whatsappMessage:
    'Olá! Vim pela Zap Page e quero uma página profissional para o meu negócio.',

  // --------- Planos ---------
  planExpress: {
    name: 'Página Express',
    badge: 'Entrada rápida',
    price: 'R$197',
    description:
      'Para quem precisa de uma página simples, bonita e direta para começar a divulgar.',
  },
  planProfessional: {
    name: 'Página Profissional',
    badge: 'Mais vendido',
    price: 'R$297',
    description:
      'Para quem quer uma página mais completa, com textos persuasivos e orientação para usar a estrutura da forma correta.',
  },
  planTurbo: {
    name: 'Turbo Vendas',
    badge: 'Melhor para anunciar',
    price: 'R$497',
    description:
      'Para quem quer página, copy, criativos e orientação inicial para divulgar com mais força.',
  },

  // --------- Rodapé / institucional ---------
  copyright: '© 2026 Zap Page. Todos os direitos reservados.',

  // --------- FAQ – respostas dinâmicas (se preferir customizar) ---------
  faqCustomAnswers: {
    mensalidade:
      'A publicação pode ser feita gratuitamente pela Vercel, em um endereço padrão. Se você quiser um domínio próprio e hospedagem personalizada, essa contratação pode ser feita à parte.',
    prazo:
      'A entrega acontece de 3 a 5 dias após a confirmação do pagamento.',
  },
}

// Mensagens curtas que dão contexto ao atendimento sem fingir que o lead já
// informou dados que ainda precisa preencher.
export const whatsappMessages = {
  recommendation:
    'Meu negócio é: [segmento]\nQuero usar a página para: [Instagram, anúncios, link da bio ou outro]\nPode me recomendar o plano ideal e confirmar os próximos passos?',
  general:
    'Meu negócio é: [segmento]\nQuero entender qual plano é mais indicado para mim.',
  plan: (planName, price) =>
    `Quero confirmar o ${planName} (${price}).\nMeu negócio é: [segmento]\nVou usar a página em: [canal]\nPode me confirmar os próximos passos?`,
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
