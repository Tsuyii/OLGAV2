import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 500, margin: '10rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div className="sec-over">404</div>
      <h1 className="sec-title" style={{ marginBottom: '1rem' }}>Page <em>introuvable</em></h1>
      <p style={{ color: 'var(--warm-gray)', fontSize: '0.87rem', marginBottom: '2rem' }}>La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="btn btn-dark">Retour à l&apos;accueil</Link>
    </div>
  )
}
