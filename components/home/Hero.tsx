import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-since">Depuis 1999</div>
        <h1 className="hero-h1">
          La femme<br />
          qui <em>choisit</em><br />
          son style.
        </h1>
        <p className="hero-p">
          Des pièces légères, élégantes et confortables, pensées pour sublimer chaque instant de votre quotidien.
        </p>
        <div className="hero-actions">
          <Link href="/collections" className="btn btn-dark">Découvrir la collection</Link>
          <Link href="/lookbook" className="btn-ghost">Lookbook</Link>
        </div>
      </div>
      <div className="hero-right">
        <Image
          className="hero-img"
          src="https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34.jpg?v=1776941720&width=900"
          alt="Femme élégante OLGA Collection SS26"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 52vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className="hero-scrim" />
        <div className="hero-badge">
          <div className="hero-badge-big">SS</div>
          <div className="hero-badge-sm">2026</div>
        </div>
        <div className="hero-caption">
          <div className="hero-caption-text">Collection Méditerranée</div>
        </div>
      </div>
    </section>
  )
}
