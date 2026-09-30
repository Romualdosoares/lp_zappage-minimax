import { useState } from 'react'
import { companyInitials, safeImageUrl, siteIconUrl } from '../lib/portfolioImages'

function ImageContent({ site }) {
  const [failed, setFailed] = useState([])
  const custom = safeImageUrl(site.image_url)
  const icon = siteIconUrl(site.site_url)
  const source = [custom, icon].find(url => url && !failed.includes(url))
  const isPreview = source === custom && site.image_kind === 'preview'
  const isIcon = source === icon && source !== custom
  return (
    <div className={`portfolio-image ${isPreview ? 'portfolio-image--preview' : 'portfolio-image--logo'}`}>
      {isPreview && <div className="portfolio-image-toolbar" aria-hidden="true"><i /><i /><i /><span>{new URL(safeImageUrl(site.site_url) || source).hostname.replace(/^www\./, '')}</span></div>}
      {source ? (
        <img src={source} width={isPreview ? 1200 : 240} height={isPreview ? 700 : 240} alt={isPreview ? `Prévia do site de ${site.company_name}` : isIcon ? `Ícone do site de ${site.company_name}` : `Logo de ${site.company_name}`}
          className={isIcon ? 'portfolio-image-icon' : ''} loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onError={() => setFailed(previous => [...previous, source])} />
      ) : (
        <span className="portfolio-image-initials" aria-label={site.company_name}>{companyInitials(site.company_name)}</span>
      )}
    </div>
  )
}

export default function PortfolioImage({ site }) {
  return <ImageContent key={`${site.image_url || ''}|${site.site_url || ''}|${site.image_kind || ''}`} site={site} />
}
