'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import { mapSupabaseAuthError } from '@/lib/auth/errors'
import { getResetPasswordUrl } from '@/lib/auth/session'
import {
  isPasswordPolicyValid,
} from '@/lib/auth/password'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FloatingInput } from '@/components/auth/FloatingInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import styles from '../auth.module.css'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const isPolicyValid = useMemo(() => isPasswordPolicyValid(password), [password])

  useEffect(() => {
    const supabase = createClient()
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setIsRecoveryFlow(true)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryFlow(true)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getResetPasswordUrl(),
    })
    // Anti-enumeration: always show success message regardless of outcome.
    setDone(true)
    setLoading(false)
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!isPolicyValid) {
      setError('Password does not meet the required policy.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(mapSupabaseAuthError(updateError, 'update-password'))
      setLoading(false)
      return
    }

    showToast('Password updated successfully. Please sign in.')
    setLoading(false)
    router.push('/auth/login?reset=success')
  }

  if (done) return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className="sec-over">Reset requested</div>
        <h1 className={`sec-title ${styles.title}`}>Check your <em>email</em></h1>
        <div className={styles.statusBox}>
          If this email exists, a reset link was sent.
        </div>
        <p className={styles.footerLinks}>
          <Link href="/auth/login">Back to login</Link>
        </p>
      </div>
    </div>
  )

  if (isRecoveryFlow) {
    return (
      <AuthLayout eyebrow="Recovery mode" title={<>Set a new <em>password</em></>}>
          <form onSubmit={handlePasswordUpdate} className={styles.form}>
            <FloatingInput
              id="new-password"
              label="New password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              showToggle
              onToggle={() => setShowPassword((v) => !v)}
              toggleLabel={showPassword ? 'Hide' : 'Show'}
              required
            />
            <PasswordStrengthMeter password={password} includeMatchRule passwordsMatch={confirmPassword === password} />
            <FloatingInput
              id="confirm-new-password"
              label="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              showToggle
              onToggle={() => setShowConfirmPassword((v) => !v)}
              toggleLabel={showConfirmPassword ? 'Hide' : 'Show'}
              required
            />

            {error && <p className={styles.fieldError}>{error}</p>}
            <button type="submit" className={`btn btn-dark ${styles.cta}`} disabled={loading}>
              {loading ? <span className={styles.spinner} aria-hidden /> : 'Update password'}
            </button>
          </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout eyebrow="Password recovery" title={<>Forgot your <em>password</em></>} showGuestLink>
        <form onSubmit={handleResetRequest} className={styles.form}>
          <FloatingInput id="reset-email" label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          {error && <p className={styles.fieldError}>{error}</p>}
          <button type="submit" className={`btn btn-dark ${styles.cta}`} disabled={loading}>
            {loading ? <span className={styles.spinner} aria-hidden /> : 'Send reset link'}
          </button>
        </form>
        <p className={styles.footerLinks}>
          <Link href="/auth/login">Back to login</Link>
        </p>
    </AuthLayout>
  )
}
