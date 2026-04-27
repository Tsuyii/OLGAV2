import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function FullBleedBanner() {
  return (
    <section className="banner r">
      <Image className="banner-img" src="https://www.olgadsn.com/cdn/shop/files/Gemini_Generated_Image_miw8x3miw8x3miw8.png?v=1776941743&width=1600" alt="Valise Élégance 2026" fill sizes="100vw" style={{ objectFit: 'cover' }} />
      <div className="banner-scrim" />
      <div className="banner-content">
        <div className="banner-over">Nouveauté · Disponible maintenant</div>
        <h2 className="banner-h2">Valise <em>Élégance</em><br />2026</h2>
        <p className="banner-p">Design sophistiqué aux finitions premium. Un accessory de mode aussi chic que fonctionnel — pour la femme moderne en mouvement.</p>
        <Link href="/collections" className="btn btn-light">Voir la collection</Link>
      </div>
    </section>
  )
}
