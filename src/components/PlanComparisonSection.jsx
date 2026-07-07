import { IconCheckCircle, IconClose } from './Icons'

const FEATURES = [
  { name: 'Página profissional', express: true, professional: true, turbo: true },
  { name: 'Botão de WhatsApp', express: true, professional: true, turbo: true },
  { name: 'Seção de serviços', express: 'Básico', professional: true, turbo: true },
  { name: 'Copy persuasiva', express: false, professional: true, turbo: 'Aprimorada' },
  { name: 'Suporte técnico', express: true, professional: true, turbo: true },
  { name: 'Suporte comercial 30 dias', express: false, professional: true, turbo: true },
  { name: 'Criativos para anúncios', express: false, professional: false, turbo: '3 peças' },
  { name: 'Texto para anúncio', express: false, professional: false, turbo: true },
  { name: 'Orientação inicial para campanha', express: false, professional: false, turbo: true },
]

function Value({ v }) {
  if (v === true)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neon/15 text-neon">
        <IconCheckCircle className="h-5 w-5" />
      </span>
    )
  if (v === false)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-ink-dark">
        <IconClose className="h-4 w-4" />
      </span>
    )
  return (
    <span className="inline-flex rounded-md bg-neon/15 px-2.5 py-1 text-xs font-bold text-neon">
      {v}
    </span>
  )
}

export default function PlanComparisonSection() {
  return (
    <section
      className="relative bg-bg-secondary py-20 sm:py-28"
      aria-labelledby="compare-title"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconCheckCircle className="h-3.5 w-3.5" /> Comparativo
          </span>
          <h2
            id="compare-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Qual plano{' '}
            <span className="text-gradient-neon">escolher?</span>
          </h2>
        </div>

        {/* Tabela */}
        <div className="mx-auto mt-12 max-w-5xl overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-neon/20">
            <thead className="bg-bg-card">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-ink-light">
                  Recursos
                </th>
                <th className="px-4 py-4 text-center text-sm font-bold text-white">
                  Express
                </th>
                <th className="px-4 py-4 text-center text-sm font-extrabold text-neon text-glow-sm">
                  Profissional
                </th>
                <th className="px-4 py-4 text-center text-sm font-bold text-white">
                  Turbo Vendas
                </th>
              </tr>
            </thead>
            <tbody className="bg-bg-card/60">
              {FEATURES.map((f, idx) => (
                <tr
                  key={f.name}
                  className={`border-t border-white/5 transition-colors hover:bg-neon/5 ${
                    idx % 2 === 0 ? '' : 'bg-bg-primary/40'
                  }`}
                >
                  <td className="px-4 py-3.5 text-sm font-medium text-white">
                    {f.name}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Value v={f.express} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Value v={f.professional} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Value v={f.turbo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recomendação */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4 rounded-2xl border border-neon/30 bg-bg-card p-6">
          <h3 className="text-base font-bold text-white">Recomendação rápida:</h3>
          <p className="text-sm leading-relaxed text-ink-light">
            Se você quer <strong className="text-white">apenas começar</strong>,
            vá de Express. Se quer uma estrutura mais{' '}
            <strong className="text-white">profissional</strong>, escolha o
            Profissional. Se pretende{' '}
            <strong className="text-white">divulgar com anúncios</strong>,
            escolha o Turbo Vendas.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-bg-primary/60 p-4 text-sm">
              <p className="font-bold text-white">Express</p>
              <p className="mt-1 text-xs text-ink-light">
                Básico em quase tudo, sem suporte comercial 30 dias e sem
                criativos.
              </p>
            </div>
            <div className="rounded-xl border border-neon/50 bg-bg-primary/60 p-4 text-sm shadow-neon-sm">
              <p className="font-bold text-neon">Profissional</p>
              <p className="mt-1 text-xs text-ink-light">
                Completo para página e suporte.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-bg-primary/60 p-4 text-sm">
              <p className="font-bold text-white">Turbo</p>
              <p className="mt-1 text-xs text-ink-light">
                Completo com página, suporte, criativos e textos para anúncios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
