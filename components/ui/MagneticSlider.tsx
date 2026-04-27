'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface MagneticSliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  labelSuffix?: string
  onChange?: (value: number) => void
  className?: string
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
function toPercent(v: number, min: number, max: number) {
  return ((v - min) / (max - min)) * 100
}
function snap(v: number, step: number, min: number, max: number) {
  const stepped = Math.round((v - min) / step) * step + min
  return clamp(stepped, min, max)
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export function MagneticSlider({
  min = 0,
  max = 1000,
  step = 1,
  defaultValue = 500,
  labelSuffix = 'EXCLUSIVE PIECES',
  onChange,
  className = '',
}: MagneticSliderProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(clamp(defaultValue, min, max))
  const [isDragging, setIsDragging] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  /* ── spring for ghost thumb ─────────────────── */
  const pct = toPercent(value, min, max)
  const rawSpring = useSpring(pct, { stiffness: 120, damping: 18, mass: 0.6 })
  useEffect(() => { rawSpring.set(pct) }, [pct, rawSpring])

  /* ── convert spring value to CSS left % ──────── */
  const ghostLeft = useTransform(rawSpring, (v) => `${v}%`)

  /* ── calculate value from pointer position ───── */
  const valueFromPointer = useCallback(
    (clientX: number): number => {
      const track = trackRef.current
      if (!track) return value
      const { left, width } = track.getBoundingClientRect()
      const ratio = clamp((clientX - left) / width, 0, 1)
      return snap(ratio * (max - min) + min, step, min, max)
    },
    [max, min, step, value]
  )

  /* ── pointer events ──────────────────────────── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)
      const next = valueFromPointer(e.clientX)
      setValue(next)
      onChange?.(next)
    },
    [onChange, valueFromPointer]
  )
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const next = valueFromPointer(e.clientX)
      setValue(next)
      onChange?.(next)
    },
    [isDragging, onChange, valueFromPointer]
  )
  const handlePointerUp = useCallback(() => setIsDragging(false), [])

  /* ── keyboard navigation ─────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next = value
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = snap(value + step, step, min, max)
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = snap(value - step, step, min, max)
      else if (e.key === 'Home') next = min
      else if (e.key === 'End') next = max
      else return
      e.preventDefault()
      setValue(next)
      onChange?.(next)
    },
    [value, step, min, max, onChange]
  )

  /* ── derived ─────────────────────────────────── */
  const thumbLeft = `${pct}%`

  return (
    <div
      className={`magnetic-slider ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        padding: '2.5rem 0 1.5rem',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── Floating label ─────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: thumbLeft,
          transform: 'translateX(-50%)',
          transition: isDragging ? 'none' : 'left 0.05s ease',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          zIndex: 10,
        }}
      >
        {/* value bubble */}
        <div
          style={{
            background: 'var(--color-ink, #1a1a1a)',
            color: 'var(--color-ivory, #faf7f2)',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
            letterSpacing: '0.12em',
            fontWeight: 400,
            padding: '4px 10px',
            borderRadius: 100,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {value.toLocaleString()} {labelSuffix}
        </div>
        {/* stem */}
        <div
          style={{
            width: 1,
            height: 8,
            background: 'var(--color-ink, #1a1a1a)',
            opacity: 0.25,
          }}
        />
      </div>

      {/* ── Track area ─────────────────────────── */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} ${labelSuffix}`}
        aria-label={labelSuffix}
        id={id}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: 'relative',
          height: 4,
          borderRadius: 100,
          background: 'rgba(26,26,26,0.1)',
          cursor: isDragging ? 'grabbing' : 'pointer',
          outline: 'none',
          touchAction: 'none',
        }}
      >
        {/* focus ring */}
        {isFocused && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 100,
              border: '2px solid var(--color-ink, #1a1a1a)',
              opacity: 0.25,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Fill track */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: thumbLeft,
            borderRadius: 100,
            background: 'linear-gradient(90deg, rgba(26,26,26,0.3) 0%, var(--color-ink, #1a1a1a) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ghost thumb (spring follower) */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: ghostLeft,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--color-ink, #1a1a1a)',
            opacity: 0.18,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Main thumb */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: thumbLeft,
            transform: 'translate(-50%, -50%)',
            width: isDragging ? 28 : 24,
            height: isDragging ? 28 : 24,
            borderRadius: '50%',
            background: 'var(--color-ink, #1a1a1a)',
            boxShadow: isDragging
              ? '0 0 0 6px rgba(26,26,26,0.12), 0 6px 24px rgba(26,26,26,0.28)'
              : '0 0 0 3px rgba(26,26,26,0.08), 0 4px 12px rgba(26,26,26,0.2)',
            transition: 'width 0.15s ease, height 0.15s ease, box-shadow 0.15s ease',
            pointerEvents: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            /* inner shine dot */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
            }}
          />
        </div>
      </div>

      {/* ── Min / Max labels ───────────────────── */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.75rem',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'var(--color-ink, #1a1a1a)',
          opacity: 0.35,
          fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
        }}
      >
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
