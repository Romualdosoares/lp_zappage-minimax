import { IconCheckCircle, IconRocket, IconShield } from './Icons'

const commitments = [
  'Sua marca, seus serviços e suas fotos no centro do projeto.',
  'Página pensada para celular, com Bio Link personalizada nos planos Profissional e Turbo.',
  'Entregas, prazo e revisões combinados antes da produção.',
]

export default function AboutSection() {
  return (
    <section id="quem-somos" className="relative py-20 sm:py-28" aria-labelledby="about-title">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left">
          <span className="badge-neon"><IconRocket className="h-3.5 w-3.5" /> Quem somos</span>
          <h2 id="about-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Zap Page cuida da página. Você cuida do <span className="text-gradient-neon">próximo corte.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-light sm:text-lg">
            Criamos páginas para barbearias que querem apresentar seu trabalho com a mesma atenção que dedicam a cada corte. Reunimos sua identidade, serviços e contato em uma experiência feita para o celular.
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
