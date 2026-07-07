import { IconTarget } from './Icons'

const NICHES = [
  'Assistência técnica',
  'Conserto de celular',
  'Barbearia',
  'Salão de beleza',
  'Manicure',
  'Estética',
  'Dentista',
  'Psicólogo',
  'Fisioterapeuta',
  'Veterinário',
  'Pet shop',
  'Banho e tosa',
  'Restaurante',
  'Hamburgueria',
  'Pizzaria',
  'Lava rápido',
  'Auto elétrica',
  'Encanador',
  'Eletricista',
  'Ar-condicionado',
  'Limpeza de sofá',
  'Dedetização',
  'Pintor',
  'Pedreiro',
  'Marceneiro',
  'Vidraçaria',
  'Serralheria',
  'Marmoraria',
  'Lavanderia',
  'Serviços locais',
]

export default function NichesSection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      aria-labelledby="niches-title"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconTarget className="h-3.5 w-3.5" /> Para quem é
          </span>
          <h2
            id="niches-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Feito para quem{' '}
            <span className="text-gradient-neon">atende, vende ou agenda</span>{' '}
            pelo WhatsApp.
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Se seu cliente chama no WhatsApp antes de comprar, pedir orçamento
            ou marcar horário, essa página é para você.
          </p>
        </div>

        <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-2.5 sm:gap-3">
          {NICHES.map(item => (
            <li
              key={item}
              className="group cursor-default rounded-full border border-neon/25 bg-bg-card px-4 py-2 text-sm font-medium text-ink-light transition-all duration-300 hover:border-neon/60 hover:bg-neon/10 hover:text-white hover:shadow-neon-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
