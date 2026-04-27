'use client'
<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { mapSupabaseAuthError } from '@/lib/auth/errors'
import { getAuthCallbackUrl } from '@/lib/auth/session'
import { useToast } from '@/context/ToastContext'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FloatingInput } from '@/components/auth/FloatingInput'
import styles from '../auth.module.css'
=======
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockUntil, setLockUntil] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [smartNext, setSmartNext] = useState('/compte')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const nextPath = useMemo(() => searchParams.get('next') || smartNext, [searchParams, smartNext])

  const isLocked = lockUntil !== null && Date.now() < lockUntil

  useEffect(() => {
    if (!lockUntil) return
    const id = window.setInterval(() => {
      const delta = Math.ceil((lockUntil - Date.now()) / 1000)
      if (delta <= 0) {
        setLockUntil(null)
        setSecondsLeft(0)
        setFailedAttempts(0)
        window.clearInterval(id)
        return
      }
      setSecondsLeft(delta)
    }, 250)
    return () => window.clearInterval(id)
  }, [lockUntil])

  useEffect(() => {
    const explicitNext = searchParams.get('next')
    if (explicitNext) {
      setSmartNext(explicitNext)
      return
    }
    const ref = document.referrer
    if (!ref) return
    try {
      const prev = new URL(ref)
      if (prev.origin !== window.location.origin) return
      if (prev.pathname.startsWith('/panier') || prev.pathname.startsWith('/products/')) {
        setSmartNext(prev.pathname + prev.search)
      }
    } catch {
      // ignore malformed referrer
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      showToast('Password reset successful. You can sign in now.')
    }
  }, [searchParams, showToast])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(nextPath)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace(nextPath)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [nextPath, router])

  function validate() {
    const localErrors: string[] = []
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      localErrors.push('Enter a valid email address.')
    }
    if (!password) {
      localErrors.push('Password is required.')
    }
    return localErrors
  }

  async function resendVerification() {
    if (!email) {
      setError('Enter your email first to resend verification.')
      return
    }
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
    showToast('Verification email sent. Check your inbox.')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (isLocked) return
    const localErrors = validate()
    if (localErrors.length > 0) {
      setError(localErrors[0])
      return
    }

    setLoading(true)
    setError(null)
    setNeedsVerification(false)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      const mapped = mapSupabaseAuthError(error, 'login')
      setError(mapped)
      const updatedAttempts = failedAttempts + 1
      setFailedAttempts(updatedAttempts)

      if (mapped.toLowerCase().includes('not verified')) {
        setNeedsVerification(true)
      }
      if (updatedAttempts >= 5) {
        const until = Date.now() + 30_000
        setLockUntil(until)
        setSecondsLeft(30)
      }
      setLoading(false)
      return
    }

    if (data.user && data.user.email_confirmed_at === null) {
      await supabase.auth.signOut()
      setNeedsVerification(true)
      setError('Your email is not verified yet. Please confirm it before signing in.')
      setLoading(false)
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()
    if (!profileData) {
      setError('Your account profile is missing. Please contact support.')
      setLoading(false)
      return
    }

    if (!rememberMe) {
      sessionStorage.setItem('olga-auth-ephemeral', '1')
    } else {
      sessionStorage.removeItem('olga-auth-ephemeral')
    }

    const guestWishlist = localStorage.getItem('guest_wishlist')
    if (guestWishlist) {
      try {
        const items = JSON.parse(guestWishlist) as string[]
        await Promise.all(items.map((productId) => fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId }),
        })))
        localStorage.removeItem('guest_wishlist')
      } catch {
        // no-op: never block login on wishlist merge failures
      }
    }

    setFailedAttempts(0)
    showToast('Welcome back.')
    router.push(nextPath)
  }

  return (
    <AuthLayout eyebrow="Mon espace" title={<>Sign <em>in</em></>}>
      <form onSubmit={handleLogin} className={styles.form}>
        <FloatingInput id="login-email" label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <FloatingInput
          id="login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          showToggle
          onToggle={() => setShowPassword((v) => !v)}
          toggleLabel={showPassword ? 'Hide' : 'Show'}
          required
        />
        <label className={styles.hint} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Remember me
        </label>
        {error && <p className={styles.fieldError}>{error}</p>}
        {isLocked && <p className={styles.countdown}>Too many attempts. Please wait {secondsLeft}s.</p>}

        {needsVerification && (
          <div className={styles.inlineNote}>
            Please verify your email first.
            <br />
            <button type="button" className={styles.subtleButton} onClick={resendVerification}>
              Resend verification email
            </button>
          </div>
        )}

        <button type="submit" className={`btn btn-dark ${styles.cta}`} disabled={loading || isLocked}>
          {loading ? <span className={styles.spinner} aria-hidden /> : 'Sign in'}
        </button>
      </form>

      <p className={styles.footerLinks}>
        No account yet? <Link href="/auth/register">Create one</Link>
        <br />
        <Link href="/auth/reset-password">Forgot password?</Link>
      </p>
    </AuthLayout>
=======
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/compte')
  }

  return (
    <div style={{ maxWidth: 420, margin: '8rem auto', padding: '0 1.5rem' }}>
      <div className="sec-over">Mon espace</div>
      <h1 className="sec-title" style={{ marginBottom: '2.5rem' }}>Se <em>connecter</em></h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="nl-input" type="email" placeholder="Adresse email" value={email} onChange={e => setEmail(e.target.value)} required style={{ borderRight: '1px solid var(--ivory-deep)' }} />
        <input className="nl-input" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ borderRight: '1px solid var(--ivory-deep)' }} />
        {error && <p style={{ color: 'var(--terra)', fontSize: '0.8rem' }}>{error}</p>}
        <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <p style={{ fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--warm-gray)', lineHeight: 1.8 }}>
        Pas encore de compte ?{' '}
        <Link href="/auth/register" style={{ color: 'var(--charcoal)', borderBottom: '1px solid var(--sand)' }}>S&apos;inscrire</Link>
        <br />
        <Link href="/auth/reset-password" style={{ color: 'var(--mid-gray)' }}>Mot de passe oublié ?</Link>
      </p>
    </div>
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
  )
}
