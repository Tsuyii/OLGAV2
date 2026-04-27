'use client'
import Image from 'next/image'
import Link from 'next/link'

const PROMOS = [
  {
    src: 'https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-23.jpg?v=1777108063&width=800',
    category: 'Prêt-à-porter & Ensembles',
    name: 'Collection Été',
    tag: "Jusqu'à −30%",
    desc: 'Robes légères, ensembles coordonnés et manteaux de saison à prix réduits.',
    big: true,
  },
  {
    src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_15_622874cb-4e7a-46ce-9a6e-9614a9a6ada4.png?v=1761642400&width=800',
    category: 'Sacs & Maroquinerie',
    name: 'Édition Limitée',
    tag: '−15%',
    desc: 'Sacs cabas, sacs à main et pochettes en édition limitée.',
    big: false,
  },
  {
    src: 'https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=800',
    category: 'Accessoires',
    name: 'Châles & Foulards',
    tag: '−25%',
    desc: 'Châles en lycra, foulards et accessoires de mode saisonniers.',
    big: false,
  },
  {
    src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_16_6dccc60d-59d2-4e62-9a8d-e9b15aa0a023.png?v=1761642435&width=800',
    category: 'Chaussures',
    name: 'Baskets & Sandales',
    tag: '−20%',
    desc: 'Toute la gamme chaussures OLGA à prix préférentiel pour la saison.',
    big: false,
  },
  {
    src: 'https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-24_9a026f90-531b-4d9f-9b6c-825759612386.jpg?v=1773329709&width=800',
    category: 'Manteaux & Vestes',
    name: 'Fin de saison',
    tag: "Jusqu'à −40%",
    desc: 'Profitez des dernières pièces de la collection hiver à prix cassés.',
    big: true,
  },
]

export default function PromotionsPage() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'var(--espresso)',
        padding: 'clamp(5rem, 12vw, 9rem) var(--side-pad) clamp(3rem, 6vw, 5rem)',
        textAlign: 'center',
      }}>
        <div className="sec-over" style={{ color: 'var(--terra-light)', marginBottom: '1.25rem' }}>Offres en cours</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 6vw, 7rem)',
          fontWeight: 300,
          color: 'var(--sand-light)',
          lineHeight: 1.04,
          marginBottom: '1.5rem',
        }}>
          Promotions <em style={{ fontStyle: 'italic', color: 'var(--terra-light)' }}>spéciales</em>
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'rgba(196,168,130,0.6)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          Des pièces OLGA sélectionnées avec soin, à prix réduits pour une durée limitée.
        </p>
      </div>

      {/* Promo grid */}
      <div style={{ padding: 'clamp(3rem, 6vw, 5rem) var(--side-pad)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {PROMOS.map((p) => (
            <Link
              key={p.name}
              href="/collections"
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--ivory-warm)',
                gridColumn: p.big ? 'span 2' : 'span 1',
              }}
              className="promo-page-card"
            >
              <div style={{ position: 'relative', aspectRatio: p.big ? '16/9' : '4/5' }}>
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  sizes={p.big ? '(max-width: 768px) 100vw, 70vw' : '(max-width: 768px) 100vw, 35vw'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(26,22,20,0.75) 0%, transparent 55%)',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--terra)',
                  color: 'white',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '2rem',
                }}>
                  {p.tag}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(196,168,130,0.8)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>{p.category}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: p.big ? '1.8rem' : '1.3rem', fontWeight: 300, color: 'var(--sand-light)', marginBottom: '0.4rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(196,168,130,0.65)', lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(3rem, 6vw, 5rem) var(--side-pad)',
        background: 'var(--ivory-warm)',
        borderTop: '1px solid var(--ivory-deep)',
      }}>
        <div className="sec-over" style={{ marginBottom: '1rem' }}>Toute la collection</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '2rem' }}>
          Découvrez toutes nos <em>pièces</em>
        </h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/collections" className="btn btn-dark">Explorer les collections</Link>
          <Link href="/lookbook" className="btn btn-outline">Voir le lookbook</Link>
        </div>
      </div>
    </>
  )
}
