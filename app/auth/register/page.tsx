'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'
import { mapSupabaseAuthError } from '@/lib/auth/errors'
import { getAuthCallbackUrl } from '@/lib/auth/session'
import { isPasswordPolicyValid } from '@/lib/auth/password'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FloatingInput } from '@/components/auth/FloatingInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showToast } = useToast()

  const isPolicyValid = isPasswordPolicyValid(password)
  const namesRegex = /^[a-zA-ZÀ-ÿ' -]+$/

  function validate() {
    if (firstName.trim().length < 2 || !namesRegex.test(firstName.trim())) {
      return 'First name must contain letters only and at least 2 characters.'
    }
    if (lastName.trim().length < 2 || !namesRegex.test(lastName.trim())) {
      return 'Last name must contain letters only and at least 2 characters.'
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address.'
    }
    if (!isPolicyValid) {
      return 'Password does not meet the required policy.'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }
    return null
  }

  async function resendVerification() {
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${getAuthCallbackUrl()}?next=/compte` },
    })
    if (resendError) {
      setError(mapSupabaseAuthError(resendError, 'signup'))
      return
    }
    showToast('Verification email sent again.')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const fullName = `${firstName.trim()} ${lastName.trim()}`
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName,
        },
        emailRedirectTo: `${getAuthCallbackUrl()}?next=/compte`,
      },
    })
    if (signUpError) {
      setError(mapSupabaseAuthError(signUpError, 'signup'))
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName,
          email: email.trim().toLowerCase(),
          newsletter_opt_in: newsletterOptIn,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      if (profileError) {
        setError('Account created, but profile setup failed. Please contact support.')
        setLoading(false)
        return
      }
    }

    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className="sec-over">Registration complete</div>
        <h1 className={`sec-title ${styles.title}`}>Welcome, <em>{firstName}</em> 🤍</h1>
        <div className={styles.statusBox}>
          Check your inbox to activate your account.
        </div>
        <button type="button" className={`btn btn-outline ${styles.cta}`} onClick={resendVerification}>
          Resend verification email
        </button>
        <p className={styles.footerLinks}>
          Already verified? <Link href="/auth/login">Go to login</Link>
        </p>
      </div>
    </div>
  )

  return (
    <AuthLayout eyebrow="Create account" title={<>Join <em>OLGA</em></>} showGuestLink>
      <form onSubmit={handleRegister} className={styles.form}>
        <FloatingInput id="register-first-name" label="First name" type="text" value={firstName} onChange={setFirstName} required />
        <FloatingInput id="register-last-name" label="Last name" type="text" value={lastName} onChange={setLastName} required />
        <FloatingInput id="register-email" label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <FloatingInput
          id="register-password"
          label="Password"
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
          id="register-confirm-password"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          showToggle
          onToggle={() => setShowConfirmPassword((v) => !v)}
          toggleLabel={showConfirmPassword ? 'Hide' : 'Show'}
          required
        />
        <label className={styles.hint} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
          I&apos;d like to receive style inspiration & exclusive offers.
        </label>

        {!isPolicyValid && password.length > 0 && <p className={styles.hint}>Password rules must all pass before submit.</p>}
        {error && <p className={styles.fieldError}>{error}</p>}

        <button type="submit" className={`btn btn-dark ${styles.cta}`} disabled={loading}>
          {loading ? <span className={styles.spinner} aria-hidden /> : 'Create account'}
        </button>
      </form>
      <p className={styles.footerLinks}>
        Already have an account? <Link href="/auth/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
