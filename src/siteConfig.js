// =============================================================
//  Zap Page - Configuração global editável
//  Centralize aqui TODAS as informações que mudam com frequência:
//  preços, número do WhatsApp, mensagens,
//  marca, contatos e copy principal.
// =============================================================

export const siteConfig = {
  // --------- Identidade ---------
  brandName: 'Zap Page',
  logoSrc: '/assets/zap-page-icon-gold.png',
  logoFullSrc: '/assets/zap-page-logo-gold.png',
  shareImageSrc: '/assets/zap-page-logo-gold.png',
  tagline: 'Páginas profissionais e links da bio para barbearias',
  // VITE_SITE_URL permite sobrescrever o domínio em ambientes de preview.
  domain: import.meta.env.VITE_SITE_URL || 'https://www.zappagepro.com.br',

  // --------- Contato / WhatsApp ---------
  whatsappNumber: '5543991229181', // DDI + DDD + número
  whatsappMessage:
    'Olá! Vim pela Zap Page e quero uma página profissional para a minha barbearia.',

  // --------- Planos ---------
  planExpress: {
    name: 'Página Express',
    badge: 'Presença essencial',
    price: 'R$197',
    installment: '10x de R$ 19,70',
    description:
      'O essencial para apresentar os serviços da sua barbearia e facilitar o primeiro contato.',
  },
  planProfessional: {
    name: 'Página Profissional',
    badge: 'Presença + divulgação',
    price: 'R$297',
    installment: '10x de R$ 29,70',
    description:
      'Uma apresentação completa para valorizar sua barbearia e apoiar sua divulgação.',
  },
  planTurbo: {
    name: 'Turbo Vendas',
    badge: 'Mais criativos',
    price: 'R$497',
    installment: '10x de R$ 49,70',
    description:
      'Uma estrutura mais completa para quem quer investir na divulgação da barbearia.',
  },

  // --------- Rodapé / institucional ---------
  copyright: '© 2026 Zap Page. Todos os direitos reservados.',

  // --------- FAQ – respostas dinâmicas (se preferir customizar) ---------
  faqCustomAnswers: {
    mensalidade:
      'A criação tem pagamento único. A publicação pode ser feita gratuitamente pela Vercel, em um endereço padrão. Domínio próprio e hospedagem personalizada são contratados à parte.',
    prazo:
      'A entrega acontece de 3 a 5 dias após a confirmação do pagamento.',
  },
}

// Mensagens curtas que dão contexto ao atendimento sem fingir que o lead já
// informou dados que ainda precisa preencher.
export const whatsappMessages = {
  recommendation:
    'Minha barbearia se chama: [nome]\nQuero divulgar em: [Instagram, WhatsApp ou anúncios]\nPode me ajudar a escolher o plano e confirmar os próximos passos?',
  general:
    'Minha barbearia se chama: [nome]\nQuero entender qual plano é mais indicado para minha barbearia.',
  plan: (planName, price) =>
    `Quero confirmar o ${planName} (${price}).\nMinha barbearia se chama: [nome]\nVou divulgar em: [canal]\nPode me confirmar os próximos passos?`,
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
