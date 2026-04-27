import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const PROMOS = [
  { src: 'https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-23.jpg?v=1777108063&width=800', lbl: 'Prêt-à-porter & Ensembles', name: 'Collection Été', tag: "Jusqu'à −30%", big: true },
  { src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_15_622874cb-4e7a-46ce-9a6e-9614a9a6ada4.png?v=1761642400&width=500', lbl: 'Sacs & Maroquinerie', name: 'Édition Limitée', tag: '−15%', big: false },
  { src: 'https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=500', lbl: 'Accessoires', name: 'Châles & Foulards', tag: '−25%', big: false },
]

export function Promotions() {
  return (
    <section className="promos">
      <div className="sec-head">
        <div>
          <ScrollReveal><div className="sec-over">Offres en cours</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="sec-title">Promotions <em>spéciales</em></h2></ScrollReveal>
        </div>
        <ScrollReveal delay={2}><a href="#" className="sec-link">Tout voir →</a></ScrollReveal>
      </div>
      <div className="promo-grid">
        {PROMOS.map((p, i) => (
          <ScrollReveal key={p.name} delay={(i as 0|1|2)} className="promo-card">
            <Image className="promo-bg" src={p.src} alt={p.name} fill sizes={p.big ? '50vw' : '25vw'} style={{ objectFit: 'cover', position: 'absolute' }} />
            <div className="promo-scrim" />
            <div className="promo-body">
              <div className="promo-lbl">{p.lbl}</div>
              <div className="promo-name">{p.name}</div>
              <div className="promo-tag">{p.tag}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
