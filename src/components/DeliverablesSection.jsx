import { IconArrowRight, IconCheck, IconDevice, IconLink, IconSparkles } from './Icons'

const PRODUCTS = [
  {
    number: '01',
    icon: IconDevice,
    label: 'Sua vitrine digital',
    title: 'Página para sua barbearia.',
    description: 'Apresente seu trabalho, serviços e informações. Facilite o contato pelo WhatsApp ou pelo link do seu sistema de agendamento.',
    included: 'Nos três planos',
    image: '/assets/barbershop/interior-atelier-gold.webp',
    alt: 'Bancada de barbearia em madeira escura, mármore preto e luz dourada',
    width: 1672,
    height: 941,
    type: 'page',
  },
  {
    number: '02',
    icon: IconLink,
    label: 'Sua marca na bio',
    title: 'Um link. A sua identidade.',
    description: 'Uma página própria para a bio do Instagram, com visual personalizado e dois botões principais: Contato e Agendamento.',
    included: 'Profissional e Turbo',
    image: '/assets/barbershop/craft-atelier-gold.webp',
    alt: 'Mãos de barbeiro trabalhando em um corte sob iluminação quente',
    width: 1280,
    height: 853,
    type: 'bio',
  },
  {
    number: '03',
    icon: IconSparkles,
    label: 'Sua divulgação',
    title: 'Criativos para aparecer.',
    description: 'Artes com a identidade da barbearia para Meta Ads, Instagram e WhatsApp. São 6 criativos no Profissional e 15 no Turbo.',
    included: 'Profissional e Turbo',
    image: '/assets/barbershop/creative-studio-gold.webp',
    alt: 'Máquina, navalha e produtos de barbearia em uma bancada escura iluminada em dourado',
    width: 1672,
    height: 941,
    type: 'creative',
  },
]

export default function DeliverablesSection() {
  return (
    <section id="entregas" className="barber-deliverables barber-section" aria-labelledby="deliverables-title">
      <div className="container-page">
        <div data-reveal className="barber-section-heading">
          <div><p className="barber-eyebrow">Feito para a sua barbearia</p><h2 id="deliverables-title">Presença de respeito.<br /><span className="text-gradient-neon">Dentro e fora da bio.</span></h2></div>
          <p>Seu trabalho merece uma apresentação à altura. Escolha a estrutura certa para mostrar sua marca e divulgar seus serviços.</p>
        </div>
        <div className="barber-products" data-reveal-group>
          {PRODUCTS.map(({ number, icon: Icon, label, title, description, included, image, alt, width, height, type }) => (
            <article className={`barber-product barber-product-${type}`} key={number} data-reveal-item>
              <figure className="barber-product-figure">
                <img src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
              </figure>
              <div className="barber-product-copy">
                <div className="barber-product-top"><span><Icon className="h-4 w-4" /> {label}</span><span>{number}</span></div>
                <span className="barber-included"><IconCheck className="h-3.5 w-3.5" /> {included}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <a href="#planos" className="barber-text-link">Compare o que vem em cada plano <IconArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  )
}
