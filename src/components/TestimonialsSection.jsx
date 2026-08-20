import { useEffect, useState } from 'react'
import { getTestimonials } from '../lib/supabaseClient'
import { IconCheckCircle, IconStar } from './Icons'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-neon" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: rating }, (_, index) => (
        <IconStar key={index} className="h-4 w-4" />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    let active = true
    getTestimonials()
      .then(rows => {
        if (active) setTestimonials(rows)
      })
      .catch(() => {
        if (active) setTestimonials([])
      })

    return () => {
      active = false
    }
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section className="relative bg-bg-secondary py-20 sm:py-28" aria-labelledby="testimonials-title">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-neon">
            <IconCheckCircle className="h-3.5 w-3.5" /> Avaliações autorizadas
          </span>
          <h2
            id="testimonials-title"
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Quem contratou conta como foi a{' '}
            <span className="text-gradient-neon">experiência</span>
          </h2>
          <p className="mt-5 text-base text-ink-light sm:text-lg">
            Depoimentos publicados com autorização dos clientes.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(item => (
            <article key={item.id} className="flex flex-col rounded-2xl border border-neon/20 bg-bg-card p-6 shadow-neon-sm">
              <Stars rating={item.rating} />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink-light">
                “{item.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <img
                  src={item.photo_url}
                  alt={`Foto de ${item.client_name}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full border border-neon/30 object-cover"
                />
                <div>
                  <p className="font-bold text-white">{item.client_name}</p>
                  <p className="text-sm text-ink-light">
                    {item.business_type}{item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
