'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback` })
    if (error) { setError(error.message); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ maxWidth: 420, margin: '8rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div className="sec-over">Email envoyé</div>
      <h1 className="sec-title" style={{ marginBottom: '1rem' }}>Vérifiez votre <em>email</em></h1>
      <p style={{ color: 'var(--warm-gray)', fontSize: '0.87rem' }}>Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 420, margin: '8rem auto', padding: '0 1.5rem' }}>
      <div className="sec-over">Récupération</div>
      <h1 className="sec-title" style={{ marginBottom: '2.5rem' }}>Mot de <em>passe oublié</em></h1>
      <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="nl-input" type="email" placeholder="Votre adresse email" value={email} onChange={e => setEmail(e.target.value)} required style={{ borderRight: '1px solid var(--ivory-deep)' }} />
        {error && <p style={{ color: 'var(--terra)', fontSize: '0.8rem' }}>{error}</p>}
        <button type="submit" className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }}>Envoyer le lien</button>
      </form>
      <p style={{ fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--warm-gray)' }}>
        <Link href="/auth/login" style={{ color: 'var(--charcoal)', borderBottom: '1px solid var(--sand)' }}>← Retour à la connexion</Link>
      </p>
    </div>
  )
}
