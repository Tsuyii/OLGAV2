'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ maxWidth: 420, margin: '8rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div className="sec-over">Inscription réussie</div>
      <h1 className="sec-title" style={{ marginBottom: '1rem' }}>Vérifiez votre <em>email</em></h1>
      <p style={{ color: 'var(--warm-gray)', fontSize: '0.87rem' }}>Un lien de confirmation a été envoyé à <strong>{email}</strong>.</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 420, margin: '8rem auto', padding: '0 1.5rem' }}>
      <div className="sec-over">Nouveau compte</div>
      <h1 className="sec-title" style={{ marginBottom: '2.5rem' }}>S&apos;<em>inscrire</em></h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="nl-input" type="email" placeholder="Adresse email" value={email} onChange={e => setEmail(e.target.value)} required style={{ borderRight: '1px solid var(--ivory-deep)' }} />
        <input className="nl-input" type="password" placeholder="Mot de passe (min. 6 caractères)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ borderRight: '1px solid var(--ivory-deep)' }} />
        {error && <p style={{ color: 'var(--terra)', fontSize: '0.8rem' }}>{error}</p>}
        <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Inscription…' : 'Créer mon compte'}
        </button>
      </form>
      <p style={{ fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--warm-gray)' }}>
        Déjà un compte ? <Link href="/auth/login" style={{ color: 'var(--charcoal)', borderBottom: '1px solid var(--sand)' }}>Se connecter</Link>
      </p>
    </div>
  )
}
