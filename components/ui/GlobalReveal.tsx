'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GlobalReveal() {
  const pathname = usePathname()

  useEffect(() => {
    function revealAll() {
      const els = document.querySelectorAll<HTMLElement>('.r:not(.vis)')
      if (!els.length) return
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('vis'); observer.unobserve(e.target) }
        }),
        { threshold: 0.05 }
      )
      els.forEach(el => observer.observe(el))
      return observer
    }

    // Run immediately and also after a short delay for dynamically rendered content
    const obs1 = revealAll()
    const timer = setTimeout(() => revealAll(), 500)

    return () => {
      obs1?.disconnect()
      clearTimeout(timer)
    }
  }, [pathname])

  return null
}
