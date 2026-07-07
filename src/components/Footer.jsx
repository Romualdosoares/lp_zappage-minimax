import { siteConfig, buildWhatsappUrl } from '../siteConfig'
import { IconWhatsapp } from './Icons'

export default function Footer() {
  return (
    <footer className="relative border-t border-neon/15 bg-bg-secondary pt-14 pb-32 sm:pb-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent"
      />
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neon shadow-neon-sm">
                <IconWhatsapp className="h-5 w-5 text-bg-primary" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {siteConfig.brandName}
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-light">
              {siteConfig.tagline}.
            </p>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-secondary mt-5"
            >
              <IconWhatsapp className="h-5 w-5" />
              Falar no WhatsApp
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neon">
              Navegação
            </h4>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Benefícios', href: '#beneficios' },
                { label: 'Planos', href: '#planos' },
                { label: 'Dúvidas', href: '#faq' },
                { label: 'WhatsApp', href: buildWhatsappUrl() },
              ].map(item => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="text-sm text-ink-light transition-colors hover:text-neon"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neon">
              Compromisso
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-ink-light">
              Não prometemos resultados específicos. A página ajuda a apresentar
              seu negócio de forma mais profissional e facilitar o contato com
              seus clientes. Resultados dependem de mercado, oferta,
              atendimento, tráfego e divulgação.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-ink-dark sm:text-sm">
          {siteConfig.copyright}
        </div>
      </div>
    </footer>
  )
}
