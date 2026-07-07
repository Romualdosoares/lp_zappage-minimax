import {
  IconQuestion,
  IconCheckCircle,
  IconShield,
} from './Icons'

const ITEMS = [
  {
    q: '“Eu já tenho Instagram.”',
    a: 'Ótimo. A página não substitui seu Instagram. Ela organiza sua oferta e vira o link profissional da sua bio.',
  },
  {
    q: '“Meu negócio é pequeno.”',
    a: 'Justamente por isso uma apresentação profissional ajuda. Ela faz seu negócio parecer mais confiável desde o primeiro contato.',
  },
  {
    q: '“Não tenho logo.”',
    a: 'Sem problema. Podemos montar uma estrutura visual simples com o nome do seu negócio.',
  },
  {
    q: '“Não entendo de site.”',
    a: 'Você não precisa mexer com nada técnico. Você envia as informações e nós criamos a página.',
  },
  {
    q: '“Isso garante vendas?”',
    a: 'Não. Nenhuma página garante vendas sozinha. O objetivo é melhorar sua apresentação, facilitar o contato e apoiar sua divulgação.',
  },
]

export default function ObjectionsSection() {
  return (
    <section
      className="relative bg-bg-secondary py-20 sm:py-28"
      aria-labelledby="objections-title"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconQuestion className="h-3.5 w-3.5" /> Dúvidas comuns
          </span>
          <h2
            id="objections-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Talvez você esteja{' '}
            <span className="text-gradient-neon">pensando…</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6">
          {ITEMS.map(({ q, a }) => (
            <article
              key={q}
              className="card-base group"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon">
                  <IconQuestion className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-white">{q}</h3>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-neon/20 bg-neon/5 p-4">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon/20 text-neon">
                  <IconCheckCircle className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-white">{a}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-2xl border border-white/10 bg-bg-card/60 p-5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/30 text-neon">
            <IconShield className="h-5 w-5" />
          </span>
          <p className="text-xs leading-relaxed text-ink-light sm:text-sm">
            <strong className="font-bold text-white">Compromisso de honestidade:</strong>{' '}
            não prometemos resultados específicos. Nosso objetivo é entregar uma
            estrutura profissional e dar orientações reais para você divulgar do
            jeito certo.
          </p>
        </div>
      </div>
    </section>
  )
}
