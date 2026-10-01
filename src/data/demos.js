export const demos = [
  {
    id: 'barbearia',
    eyebrow: 'Demonstração · serviços locais',
    name: 'Corte & Classe',
    category: 'Barbearia',
    title: 'Uma agenda mais cheia começa com uma apresentação que dá vontade de marcar.',
    description: 'Modelo focado em serviços, localização, prova visual e botão de agendamento pelo WhatsApp.',
    palette: 'from-[#41d108] via-[#37c400] to-[#37c400]',
    accent: 'gold',
    services: ['Corte clássico', 'Barba completa', 'Combo corte + barba'],
    benefits: ['Agenda pelo WhatsApp', 'Preços e serviços claros', 'Localização em destaque'],
  },
  {
    id: 'clinica',
    eyebrow: 'Demonstração · saúde e bem-estar',
    name: 'Clínica Essencial',
    category: 'Clínica',
    title: 'Informações claras para o paciente se sentir seguro antes do primeiro contato.',
    description: 'Modelo que prioriza especialidades, acolhimento, perguntas frequentes e solicitação de horário.',
    palette: 'from-[#41d108] via-[#37c400] to-[#37c400]',
    accent: 'gold',
    services: ['Avaliação personalizada', 'Atendimento humanizado', 'Acompanhamento contínuo'],
    benefits: ['Especialidades organizadas', 'CTA de agendamento', 'Design leve e confiável'],
  },
  {
    id: 'restaurante',
    eyebrow: 'Demonstração · alimentação',
    name: 'Forno & Brasa',
    category: 'Restaurante',
    title: 'Um cardápio que abre o apetite e facilita o pedido em poucos toques.',
    description: 'Modelo preparado para destacar pratos, horários, entrega e pedidos rápidos pelo WhatsApp.',
    palette: 'from-[#41d108] via-[#37c400] to-[#37c400]',
    accent: 'gold',
    services: ['Pratos da casa', 'Combos para compartilhar', 'Delivery no bairro'],
    benefits: ['Cardápio objetivo', 'Horários visíveis', 'Pedido direto no WhatsApp'],
  },
]

export function getDemo(id) {
  return demos.find(demo => demo.id === id)
}
