import { useState } from 'react'
import { siteConfig } from '../siteConfig'
import { IconChevronDown, IconQuestion, IconShield } from './Icons'

const FAQS = [
  {
    q: 'Essa página é um site?',
    a: 'É uma página profissional de apresentação, criada para divulgar seu negócio, organizar suas informações e levar clientes direto para o WhatsApp.',
  },
  {
    q: 'Serve para qualquer negócio?',
    a: 'Sim. É ideal para negócios locais, prestadores de serviço, clínicas, salões, restaurantes, assistências técnicas, profissionais autônomos e empresas que atendem pelo WhatsApp.',
  },
  {
    q: 'Preciso ter logo?',
    a: 'Não. Se você tiver logo, usamos. Se não tiver, criamos uma estrutura visual simples e profissional com o nome do seu negócio.',
  },
  {
    q: 'O cliente chama direto no WhatsApp?',
    a: 'Sim. A página terá botões conectados ao WhatsApp do seu negócio, com mensagem pré-preenchida.',
  },
  {
    q: 'Posso usar no Instagram?',
    a: 'Sim. Você pode usar o link na bio do Instagram, nos stories, no WhatsApp, em cartões digitais, anúncios e materiais de divulgação.',
  },
  {
    q: 'Posso usar em anúncios?',
    a: 'Sim. A página pode ser usada como destino para anúncios no Facebook, Instagram, Google e outros canais.',
  },
  {
    q: 'Tem mensalidade?',
    a: siteConfig.faqCustomAnswers.mensalidade,
  },
  {
    q: 'Quanto tempo demora para ficar pronta?',
    a: siteConfig.faqCustomAnswers.prazo,
  },
  {
    q: 'Tem garantia de vendas?',
    a: 'Não prometemos vendas garantidas. Os resultados dependem do seu mercado, oferta, atendimento, divulgação e tráfego. A página ajuda a melhorar sua apresentação e facilitar o contato.',
  },
  {
    q: 'Como funciona depois da compra?',
    a: 'Depois da compra, você envia as informações do negócio, como nome, WhatsApp, cidade, serviços, fotos, logo e diferenciais. Depois criamos a página conforme o plano escolhido.',
  },
]

function Item({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = `faq-${q.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        open
          ? 'border-neon/60 bg-bg-cardPremium shadow-neon-sm'
          : 'border-neon/20 bg-bg-card hover:border-neon/40'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span className="text-sm font-bold text-white sm:text-base">
          {q}
        </span>
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon/40 bg-neon/10 text-neon transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <IconChevronDown className="h-5 w-5" />
        </span>
      </button>
      <div
        id={id}
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-ink-light sm:px-6 sm:pb-6 sm:text-base">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28"
      aria-labelledby="faq-title"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconQuestion className="h-3.5 w-3.5" /> FAQ
          </span>
          <h2
            id="faq-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Perguntas{' '}
            <span className="text-gradient-neon">frequentes</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Se a sua dúvida não estiver aqui, é só chamar no WhatsApp.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:gap-4">
          {FAQS.map((f, idx) => (
            <Item key={f.q} {...f} defaultOpen={idx === 0} />
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-neon/30 bg-neon-dark/20 p-5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/40 text-neon">
            <IconShield className="h-5 w-5" />
          </span>
          <p className="text-xs leading-relaxed text-ink-light sm:text-sm">
            <strong className="text-white">Transparência:</strong> não
            prometemos resultados garantidos. Nosso foco é entregar uma
            estrutura profissional sólida e ajudar você a usá-la bem.
          </p>
        </div>
      </div>
    </section>
  )
}
