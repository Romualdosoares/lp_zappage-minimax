import { useState } from 'react'
import { siteConfig } from '../siteConfig'
import { IconChevronDown, IconQuestion, IconShield } from './Icons'

const FAQS = [
  {
    q: 'Essa página é um site?',
    a: 'É uma página profissional de apresentação, criada para divulgar seu negócio, organizar suas informações e levar clientes direto para o WhatsApp.',
  },
  {
    q: 'Serve para o meu tipo de negócio?',
    a: 'Funciona especialmente bem para negócios locais, profissionais e empresas que atendem, vendem ou agendam pelo WhatsApp.',
  },
  {
    q: 'O cliente fala direto no meu WhatsApp?',
    a: 'Sim. Os botões podem ser conectados ao WhatsApp do seu negócio, com uma mensagem inicial já preenchida.',
  },
  {
    q: 'Posso divulgar no Instagram e em anúncios?',
    a: 'Sim. O link pode ser usado na bio do Instagram, nos stories, no WhatsApp, em cartões digitais e como destino de anúncios.',
  },
  {
    q: 'Preciso ter logo e fotos profissionais?',
    a: 'Não. Se tiver, usamos. Se não tiver, montamos uma estrutura visual simples e orientamos o que enviar no briefing.',
  },
  {
    q: 'Tem mensalidade ou domínio incluso?',
    a: siteConfig.faqCustomAnswers.mensalidade,
  },
  {
    q: 'Quanto tempo demora e quantas revisões tenho?',
    a: `${siteConfig.faqCustomAnswers.prazo} Todos os planos incluem até 3 revisões para ajustar os detalhes da página.`,
  },
  {
    q: 'O que acontece depois que eu chamar no WhatsApp?',
    a: 'Você informa seu segmento e objetivo. Confirmamos o plano e o escopo. Após o pagamento, enviamos o briefing para reunir os dados do seu negócio.',
  },
]

function Item({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = `faq-${q.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <div data-reveal-item className={`overflow-hidden rounded-2xl border transition-all duration-300 ${open ? 'border-neon/40 bg-bg-cardPremium' : 'border-white/10 bg-bg-card hover:border-white/20'}`}>
      <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
        <span className="text-sm font-bold text-white sm:text-base">{q}</span>
        <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon/40 bg-neon/10 text-neon transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><IconChevronDown className="h-5 w-5" /></span>
      </button>
      <div id={id} className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-ink-light sm:px-6 sm:pb-6 sm:text-base">{a}</p></div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="container-page">
        <div data-reveal className="max-w-4xl">
          <span className="badge-neon"><IconQuestion className="h-3.5 w-3.5" /> FAQ</span>
          <h2 id="faq-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">Perguntas <span className="text-gradient-neon">frequentes</span></h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">Se a sua dúvida não estiver aqui, é só chamar no WhatsApp.</p>
        </div>
        <div data-reveal-group className="mt-12 grid max-w-4xl gap-3 sm:gap-4">
          {FAQS.map((item, index) => <Item key={item.q} {...item} defaultOpen={index === 0} />)}
        </div>
        <div data-reveal className="mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-white/10 bg-neon-dark/20 p-5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/40 text-neon"><IconShield className="h-5 w-5" /></span>
          <p className="text-xs leading-relaxed text-ink-light sm:text-sm"><strong className="text-white">Transparência:</strong> não prometemos resultados garantidos. Nosso foco é entregar uma estrutura profissional e fácil de usar.</p>
        </div>
      </div>
    </section>
  )
}
