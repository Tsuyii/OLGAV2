'use client'

import styles from './auth-ui.module.css'

type FloatingInputProps = {
  id: string
  label: string
  type: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  required?: boolean
  showToggle?: boolean
  onToggle?: () => void
  toggleLabel?: string
}

export function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = false,
  showToggle = false,
  onToggle,
  toggleLabel = 'Show',
}: FloatingInputProps) {
  return (
    <div className={styles.floatingWrap}>
      <input
        id={id}
        className={styles.input}
        type={type}
        value={value}
        placeholder=" "
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {showToggle && onToggle ? (
        <button type="button" className={styles.toggle} onClick={onToggle}>
          {toggleLabel}
        </button>
      ) : null}
    </div>
  )
}
