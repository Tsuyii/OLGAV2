'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  children: React.ReactNode
  delay?: 0 | 1 | 2 | 3 | 4 | 5
  className?: string
}

export function ScrollReveal({ children, delay, className = '' }: Props) {
  const ref = useScrollReveal()
  const delayClass = delay ? ` d${delay}` : ''
  return (
    <div ref={(node) => { ref.current = node }} className={`r${delayClass} ${className}`.trim()}>
      {children}
    </div>
  )
}
