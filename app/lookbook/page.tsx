'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LOOKS = [
  {
    id: 1,
    title: 'Collection Printemps',
    category: 'Prêt-à-porter',
    src: 'https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=800',
    tall: true,
  },
  {
    id: 2,
    title: 'Sac Signature',
    category: 'Sacs à main',
    src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_16_6dccc60d-59d2-4e62-9a8d-e9b15aa0a023.png?v=1761642435&width=800',
    tall: false,
  },
  {
    id: 3,
    title: 'Basket OLGA',
    category: 'Chaussures',
    src: 'https://cdn.shopify.com/s/files/1/0564/5179/2966/files/Designsanstitre_38.png?v=1760095602',
    tall: false,
  },
  {
    id: 4,
    title: 'Sac Cabas Été',
    category: 'Sacs à main',
    src: 'https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-23.jpg?v=1777108063&width=800',
    tall: true,
  },
  {
    id: 5,
    title: 'Manteau Écru',
    category: 'Prêt-à-porter',
    src: 'https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-24_9a026f90-531b-4d9f-9b6c-825759612386.jpg?v=1773329709&width=800',
    tall: false,
  },
  {
    id: 6,
    title: 'Châle Lycra',
    category: 'Accessoires',
    src: 'https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=800',
    tall: false,
  },
  {
    id: 7,
    title: 'Basket Casual',
    category: 'Chaussures',
    src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_2_1cdab00e-9f51-4d4a-8470-ef8dcbdf9ca9.png?v=1771504793&width=800',
    tall: false,
  },
  {
    id: 8,
    title: 'Sac Bandoulière',
    category: 'Sacs à main',
    src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_14_c6ced9d3-24f8-4e97-8a2e-f09cde789bb7.png?v=1761642468&width=800',
    tall: false,
  },
  {
    id: 9,
    title: 'Manteau SS26',
    category: 'Prêt-à-porter',
    src: 'https://www.olgadsn.com/cdn/shop/files/a_28.png?v=1773411118&width=800',
    tall: true,
  },
]

export default function LookbookPage() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.r')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); observer.unobserve(e.target) } }),
      { threshold: 0.05 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Hero */}
      <div className="lookbook-hero">
        <div>
          <div className="sec-over" style={{ color: 'var(--terra-light)', marginBottom: '1.5rem' }}>Printemps · Été 2026</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5.5vw, 6.5rem)', fontWeight: 300, color: 'var(--sand-light)', lineHeight: 1.04, marginBottom: '2rem' }}>
            L&apos;élégance<br /><em style={{ fontStyle: 'italic', color: 'var(--terra-light)' }}>marocaine</em>
          </h1>
          <p style={{ fontSize: '0.87rem', color: 'rgba(196,168,130,0.65)', lineHeight: 1.8, maxWidth: 360, marginBottom: '2.5rem' }}>
            Des silhouettes pensées pour la femme moderne — entre héritage culturel et mode contemporaine.
          </p>
          <Link href="/collections" className="btn" style={{ background: 'transparent', border: '1px solid rgba(196,168,130,0.4)', color: 'var(--sand-light)' }}>
            Découvrir la collection
          </Link>
        </div>
        <div style={{ position: 'relative', height: 480 }}>
          <Image
            src="https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=800"
            alt="Lookbook OLGA SS26"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* Season label */}
      <div className="lookbook-bar">
        <span className="sec-over">Collection SS26 — {LOOKS.length} looks</span>
        <Link href="/collections" className="sec-link">Voir les produits →</Link>
      </div>

      {/* Masonry-style grid */}
      <div className="lookbook-grid">
        {LOOKS.map((look) => (
          <Link key={look.id} href="/collections" className={`lookbook-cell r${look.tall ? ' tall' : ''}`} style={{ textDecoration: 'none' }}>
            <Image
              className="lookbook-cell-img"
              src={look.src}
              alt={look.title}
              width={600}
              height={look.tall ? 800 : 400}
              style={{ objectFit: 'cover', width: '100%', height: look.tall ? 660 : 320 }}
            />
            <div className="lookbook-cell-label">
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: '0.25rem', color: 'var(--terra-light)' }}>{look.category}</div>
              {look.title}
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial strip */}
      <div className="lookbook-editorial">
        <div>
          <div className="lookbook-number">25</div>
          <div className="sec-over" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Ans de mode marocaine</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Des pièces qui <em>racontent</em> une histoire
          </h2>
          <p style={{ fontSize: '0.87rem', color: 'var(--warm-gray)', lineHeight: 1.8, maxWidth: 400, marginBottom: '2rem' }}>
            Chaque saison, OLGA imagine des collections qui mêlent l&apos;artisanat marocain aux codes de la mode internationale. Des matières soigneusement choisies, des coupes intemporelles.
          </p>
          <Link href="/a-propos" className="btn btn-outline">Notre histoire →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            'https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-15.jpg?v=1777108063&width=500',
            'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_15_622874cb-4e7a-46ce-9a6e-9614a9a6ada4.png?v=1761642400&width=500',
            'https://cdn.shopify.com/s/files/1/0564/5179/2966/files/photo_2025-10-10_12-13-15.jpg?v=1760095629',
            'https://cdn.shopify.com/s/files/1/0564/5179/2966/files/photo_2025-10-10_12-30-16.jpg?v=1760096259',
          ].map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
              <Image src={src} alt={`Look ${i + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="lookbook-cta">
        <div className="sec-over" style={{ marginBottom: '1rem' }}>Toute la collection</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '2rem' }}>
          Trouvez votre <em>pièce signature</em>
        </h2>
        <Link href="/collections" className="btn btn-dark">Explorer les collections</Link>
      </div>
    </>
  )
}
