import { useEffect, useRef } from 'react'

const REVEAL_SELECTOR = '[data-reveal], [data-reveal-group]'

export default function ScrollExperience() {
  const progressRef = useRef(null)

  useEffect(() => {
    const progress = progressRef.current
    let frame = 0
    let layoutObserver

    const updateProgress = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      progress?.style.setProperty('transform', `scaleX(${value})`)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })
    if ('ResizeObserver' in window) {
      layoutObserver = new ResizeObserver(requestUpdate)
      layoutObserver.observe(document.body)
    }

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      layoutObserver?.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const root = document.documentElement
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let revealObserver
    let contentObserver
    let registered = new WeakSet()

    const stop = ({ reset = false } = {}) => {
      revealObserver?.disconnect()
      contentObserver?.disconnect()
      revealObserver = undefined
      contentObserver = undefined
      root.classList.remove('motion-enhanced')

      if (reset) {
        document.querySelectorAll(REVEAL_SELECTOR).forEach(element => {
          element.classList.remove('is-visible')
        })
      }
    }

    const start = () => {
      stop({ reset: !motionPreference.matches })

      if (motionPreference.matches) return

      registered = new WeakSet()
      root.classList.add('motion-enhanced')
      revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            revealObserver?.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -9% 0px' },
      )

      const register = node => {
        if (!(node instanceof Element)) return

        const candidates = [
          ...(node.matches(REVEAL_SELECTOR) ? [node] : []),
          ...node.querySelectorAll(REVEAL_SELECTOR),
        ]

        candidates.forEach(element => {
          if (registered.has(element)) return
          registered.add(element)

          if (window.scrollY > 0 && element.getBoundingClientRect().bottom <= 0) {
            element.classList.add('is-visible')
            return
          }

          revealObserver?.observe(element)
        })
      }

      register(document.body)

      contentObserver = new MutationObserver(records => {
        records.forEach(record => {
          record.addedNodes.forEach(register)
        })
      })
      contentObserver.observe(document.getElementById('root') || document.body, {
        childList: true,
        subtree: true,
      })
    }

    const handlePreferenceChange = () => start()
    start()
    if (motionPreference.addEventListener) {
      motionPreference.addEventListener('change', handlePreferenceChange)
    } else {
      motionPreference.addListener?.(handlePreferenceChange)
    }

    return () => {
      if (motionPreference.removeEventListener) {
        motionPreference.removeEventListener('change', handlePreferenceChange)
      } else {
        motionPreference.removeListener?.(handlePreferenceChange)
      }
      stop({ reset: true })
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={progressRef} className="scroll-progress__bar" />
    </div>
  )
}
