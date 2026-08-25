import { IconCheckCircle, IconRocket, IconShield } from './Icons'

const commitments = [
  'Comunicação simples, sem termos técnicos desnecessários.',
  'Estrutura pensada primeiro para quem acessa pelo celular.',
  'Escopo e próximos passos confirmados antes da produção.',
]

export default function AboutSection() {
  return (
    <section id="quem-somos" className="relative py-20 sm:py-28" aria-labelledby="about-title">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left">
          <span className="badge-neon"><IconRocket className="h-3.5 w-3.5" /> Quem somos</span>
          <h2 id="about-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Zap Page cria páginas diretas para negócios que <span className="text-gradient-neon">vendem conversando.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-light sm:text-lg">
            Transformamos informações espalhadas em uma apresentação profissional, rápida e fácil de divulgar. O objetivo é simples: deixar claro o que você oferece e tornar o próximo passo pelo WhatsApp mais natural.
          </p>
        </div>
        <div data-reveal="right" className="card-animated-subtle rounded-2xl bg-bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-neon"><IconShield className="h-6 w-6" /><p className="font-bold text-white">Nosso compromisso</p></div>
          <ul className="mt-6 space-y-4">
            {commitments.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-light"><IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-neon" />{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
