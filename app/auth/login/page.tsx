'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  )
}
