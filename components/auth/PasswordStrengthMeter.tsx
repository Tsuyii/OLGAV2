'use client'

import { getPasswordRules, getPasswordStrength, getPasswordStrengthPercent } from '@/lib/auth/password'
import styles from './auth-ui.module.css'

export function PasswordStrengthMeter({
  password,
  includeMatchRule = false,
  passwordsMatch = false,
}: {
  password: string
  includeMatchRule?: boolean
  passwordsMatch?: boolean
}) {
  const rules = getPasswordRules(password)
  const displayRules = includeMatchRule
    ? [...rules, { id: 'match', label: 'Confirm password matches', valid: passwordsMatch }]
    : rules

  const strength = getPasswordStrength(password)
  const percent = getPasswordStrengthPercent(password)
  const strengthClass =
    strength === 'Weak' ? styles.weak : strength === 'Fair' ? styles.fair : strength === 'Strong' ? styles.strong : styles.veryStrong

  return (
    <div className={styles.meter}>
      <div className={styles.bar}>
        <div className={`${styles.fill} ${strengthClass}`} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.meterTitle}>Strength: {strength}</div>
      <ul className={styles.rules}>
        {displayRules.map((rule) => (
          <li key={rule.id} className={rule.valid ? styles.ok : styles.ko}>
            <span aria-hidden>{rule.valid ? '✓' : '✕'}</span>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
