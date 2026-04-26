'use client'
import Image from 'next/image'
import Link from 'next/link'

const TIMELINE = [
  { year: '1999', title: 'La fondation', text: 'OLGA naît à Casablanca de la passion de Mohammed Sefrioui pour la mode féminine marocaine — élégante, accessible et ancrée dans l\'identité locale.' },
  { year: '2005', title: 'Première boutique', text: 'Ouverture de la première boutique sur le Boulevard Zerktouni. La marque s\'impose rapidement comme référence du prêt-à-porter féminin de qualité.' },
  { year: '2012', title: 'Expansion nationale', text: 'OLGA ouvre ses deuxième et troisième boutiques à Rabat et Marrakech, portant sa vision à travers tout le Maroc.' },
  { year: '2019', title: 'Lancement accessoires', text: 'La gamme sacs et chaussures est lancée, complétant l\'offre mode et renforçant l\'identité lifestyle de la marque.' },
  { year: '2024', title: 'OLGA en ligne', text: 'Lancement de la boutique en ligne — OLGA accessible partout au Maroc, livraison 2-4 jours ouvrés, retours gratuits.' },
  { year: '2026', title: 'Collection SS26', text: 'La collection Printemps-Été 2026 célèbre 25 ans de mode marocaine avec des silhouettes modernisées et des matières premium.' },
]

const VALUES = [
  { num: '25', label: 'Ans d\'expertise', desc: 'Deux décennies à habiller la femme marocaine moderne avec élégance et authenticité.' },
  { num: '3', label: 'Boutiques au Maroc', desc: 'Casablanca, Rabat et Marrakech — présence nationale pour vous accueillir.' },
  { num: '100%', label: 'Made with passion', desc: 'Chaque pièce est pensée pour durer, alliant savoir-faire artisanal et design contemporain.' },
]

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <div className="about-hero">
        <div className="sec-over" style={{ color: 'var(--terra-light)', marginBottom: '1.5rem' }}>Notre histoire</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 7rem)', fontWeight: 300, color: 'var(--sand-light)', lineHeight: 1.04, maxWidth: 700, marginBottom: '2rem' }}>
          25 ans de mode<br /><em style={{ fontStyle: 'italic', color: 'var(--terra-light)' }}>marocaine</em>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(196,168,130,0.65)', lineHeight: 1.8, maxWidth: 520 }}>
          Fondée en 1999, OLGA est une marque marocaine de mode féminine qui allie l&apos;élégance contemporaine aux racines culturelles du Maroc. Sacs, chaussures, prêt-à-porter et accessoires — une mode pensée pour la femme d&apos;aujourd&apos;hui.
        </p>
      </div>

      {/* Timeline */}
      <div className="about-timeline">
        <div style={{ position: 'relative', aspectRatio: '3/4' }}>
          <Image
            src="https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=800"
            alt="OLGA histoire"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'var(--ivory)', padding: '1.5rem 2rem', maxWidth: 240 }}>
            <div className="sec-over" style={{ marginBottom: '0.5rem' }}>Notre vision</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>
              Créer une mode féminine qui honore le Maroc tout en embrassant le monde.
            </p>
          </div>
        </div>

        <div>
          <div className="sec-over" style={{ marginBottom: '0.75rem' }}>Chronologie</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Une marque qui <em>grandit</em>
          </h2>
          <ul className="timeline-list">
            {TIMELINE.map((item) => (
              <li key={item.year} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-text">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Values */}
      <div className="about-values">
        {VALUES.map((v) => (
          <div key={v.num} className="about-value">
            <div className="about-value-num">{v.num}</div>
            <div className="about-value-label">{v.label}</div>
            <div className="about-value-desc">{v.desc}</div>
          </div>
        ))}
      </div>

      {/* Editorial image strip */}
      <div className="editorial-strip">
        {[
          'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_16_6dccc60d-59d2-4e62-9a8d-e9b15aa0a023.png?v=1761642435&width=600',
          'https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-24_9a026f90-531b-4d9f-9b6c-825759612386.jpg?v=1773329709&width=600',
          'https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-23.jpg?v=1777108063&width=600',
          'https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=600',
        ].map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
            <Image src={src} alt={`OLGA ${i + 1}`} fill style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* Mission statement */}
      <div className="about-mission">
        <div className="sec-over" style={{ marginBottom: '1.5rem' }}>Notre engagement</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '2rem' }}>
          La mode marocaine mérite<br /><em>d&apos;être célébrée</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray)', lineHeight: 1.9, marginBottom: '2.5rem' }}>
          Chez OLGA, chaque collection est une invitation à redécouvrir la beauté du style marocain. Nous collaborons avec des artisans locaux, sélectionnons des matières durables et concevons des pièces qui traversent les saisons sans perdre leur âme.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/collections" className="btn btn-dark">Découvrir nos collections</Link>
          <Link href="/lookbook" className="btn btn-outline">Voir le lookbook</Link>
        </div>
      </div>
    </>
  )
}
