import { useEffect, useRef, useState } from 'react'

export default function useNearViewport(rootMargin = '800px 0px') {
  const targetRef = useRef(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target || isNear) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsNear(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        setIsNear(true)
        observer.disconnect()
      },
      { rootMargin, threshold: 0.01 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [isNear, rootMargin])

  return [targetRef, isNear]
}
