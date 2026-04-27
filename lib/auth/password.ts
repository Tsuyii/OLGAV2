export type PasswordRule = {
  id: 'min' | 'max' | 'upper' | 'lower' | 'number' | 'special'
  label: string
  valid: boolean
}

export type PasswordStrength = 'Weak' | 'Fair' | 'Strong' | 'Very Strong'

const SPECIAL = /[!@#$%^&*]/

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { id: 'min', label: 'Minimum 8 characters', valid: password.length >= 8 },
    { id: 'max', label: 'Maximum 72 characters', valid: password.length <= 72 },
    { id: 'upper', label: 'At least 1 uppercase letter', valid: /[A-Z]/.test(password) },
    { id: 'lower', label: 'At least 1 lowercase letter', valid: /[a-z]/.test(password) },
    { id: 'number', label: 'At least 1 number', valid: /[0-9]/.test(password) },
    { id: 'special', label: 'At least 1 special (!@#$%^&*)', valid: SPECIAL.test(password) },
  ]
}

export function isPasswordPolicyValid(password: string): boolean {
  return getPasswordRules(password).every((rule) => rule.valid)
}

export function getPasswordStrength(password: string): PasswordStrength {
  const rules = getPasswordRules(password)
  const passed = rules.filter((rule) => rule.valid).length

  if (passed <= 2) return 'Weak'
  if (passed <= 4) return 'Fair'
  if (passed === 5) return 'Strong'
  return 'Very Strong'
}

export function getPasswordStrengthPercent(password: string): number {
  const rules = getPasswordRules(password)
  const passed = rules.filter((rule) => rule.valid).length
  return Math.round((passed / rules.length) * 100)
}
