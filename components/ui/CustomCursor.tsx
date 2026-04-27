'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
export interface CustomCursorProps {
  /** Small dot colour (default: OLGA espresso) */
  cursorColor?: string
  /** Follower ring colour (default: OLGA sand, semi-transparent) */
  followerColor?: string
  /** Colour applied to both on hover (default: OLGA terra) */
  hoverColor?: string
  /** Fully disable the custom cursor */
  disabled?: boolean
}

const HOVER_SELECTOR =
  'a, button, [role="button"], [data-cursor-hover], label[for], select, input[type="range"]'

/* ─────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */
export function CustomCursor({
  cursorColor   = '#3D2E24',   // --espresso
  followerColor = '#C4A882',   // --sand
  hoverColor    = '#C4563A',   // --terra
  disabled      = false,
}: CustomCursorProps) {
  const [active,     setActive]     = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible,  setIsVisible]  = useState(false)

  /* ── RAF ref for main dot (zero re-renders) ──────── */
  const dotRef = useRef<HTMLDivElement>(null)
  const rafId  = useRef<number | null>(null)
  const mouse  = useRef({ x: -200, y: -200 })

  /* ── Framer Motion spring for follower ───────────── */
  const fx = useMotionValue(-200)
  const fy = useMotionValue(-200)
  /* Tuned for OLGA's premium feel: slow, elastic, organic */
  const springX = useSpring(fx, { stiffness: 45, damping: 16, mass: 1 })
  const springY = useSpring(fy, { stiffness: 45, damping: 16, mass: 1 })

  /* ── RAF loop ────────────────────────────────────── */
  const startLoop = useCallback(() => {
    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
  }, [])

  const stopLoop = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [])

  /* ── Detect pointer device ───────────────────────── */
  useEffect(() => {
    const isTouchOnly = window.matchMedia('(hover: none)').matches
    const isSmall     = window.innerWidth < 768
    if (disabled || isTouchOnly || isSmall) return
    setActive(true)
    return () => setActive(false)
  }, [disabled])

  /* ── Register events ─────────────────────────────── */
  useEffect(() => {
    if (!active) return

    document.body.style.cursor = 'none'
    startLoop()

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      fx.set(e.clientX)
      fy.set(e.clientY)
      setIsVisible(true)
    }

    const onOver  = (e: MouseEvent) => setIsHovering(!!(e.target as Element).closest(HOVER_SELECTOR))
    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover',   onOver,   { passive: true })
    document.addEventListener('mouseleave',  onLeave)
    document.addEventListener('mouseenter',  onEnter)

    return () => {
      document.body.style.cursor = ''
      stopLoop()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [active, fx, fy, startLoop, stopLoop])

  if (!active) return null

  /* Derived colours */
  const dotBg      = isHovering ? hoverColor    : cursorColor
  const ringBorder = isHovering ? hoverColor    : followerColor
  const ringBg     = isHovering
    ? `${hoverColor}18`       // 9% terra
    : `${followerColor}14`   // 8% sand

  return (
    <>
      {/* ── Main dot — moved purely via RAF ─────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          top:            0,
          left:           0,
          zIndex:         99999,
          pointerEvents:  'none',
          width:          isHovering ? 10 : 7,
          height:         isHovering ? 10 : 7,
          borderRadius:   '50%',
          background:     dotBg,
          opacity:        isVisible ? 1 : 0,
          willChange:     'transform',
          transition:
            'width 0.2s cubic-bezier(0.22,1,0.36,1), height 0.2s cubic-bezier(0.22,1,0.36,1), background 0.25s ease, opacity 0.3s ease',
        }}
      />

      {/* ── Follower ring — Framer Motion spring ────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position:     'fixed',
          top:           0,
          left:          0,
          x:             springX,
          y:             springY,
          translateX:    '-50%',
          translateY:    '-50%',
          zIndex:        99998,
          pointerEvents: 'none',
          width:         isHovering ? 56 : 38,
          height:        isHovering ? 56 : 38,
          borderRadius:  '50%',
          background:    ringBg,
          border:        `1.5px solid ${ringBorder}`,
          opacity:       isVisible ? 0.75 : 0,
          willChange:    'transform',
          /* CSS transitions for size/colour — spring handles position */
          transition:
            'width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
        }}
      />
    </>
  )
}
