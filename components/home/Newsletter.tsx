'use client'
import { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const { showToast } = useToast()

  function subscribe() {
    if (email && email.includes('@')) {
      showToast('✓ Inscription confirmée !')
      setEmail('')
    }
  }

  return (
    <section className="newsletter">
      <div>
        <ScrollReveal><div className="nl-over">Restez connectée</div></ScrollReveal>
        <ScrollReveal delay={1}><h2 className="nl-h2">L&apos;élégance,<br /><em>en exclusivité.</em></h2></ScrollReveal>
      </div>
      <ScrollReveal delay={2}>
        <p className="nl-desc">Recevez en avant-première nos nouvelles collections, offres exclusives et inspirations mode directement dans votre boîte mail.</p>
        <div className="nl-row">
          <input type="email" className="nl-input" placeholder="Votre adresse email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="nl-btn" onClick={subscribe}>S&apos;inscrire</button>
        </div>
        <p className="nl-note">En vous inscrivant, vous acceptez notre politique de confidentialité.</p>
      </ScrollReveal>
    </section>
  )
}
