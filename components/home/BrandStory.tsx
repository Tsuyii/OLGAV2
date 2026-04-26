import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function BrandStory() {
  return (
    <section className="story">
      <div className="story-img">
        <Image src="https://www.olgadsn.com/cdn/shop/files/preview_images/4b1a60c4bceb43cc9f4e64b641475621.thumbnail.0000000000_720x.jpg?v=1776944116" alt="OLGA Brand Story" fill sizes="50vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="story-text">
        <div>
          <ScrollReveal><div className="story-over">Notre histoire</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="story-h2">25 ans de mode<br /><em>marocaine</em></h2></ScrollReveal>
          <ScrollReveal delay={2}><p className="story-p">Fondée en 1999 par Mohammed Sefrioui, OLGA est née d&apos;une vision simple : créer une mode féminine qui allie l&apos;élégance contemporaine aux racines culturelles du Maroc.</p></ScrollReveal>
          <ScrollReveal delay={3}>
            <div className="story-timeline">
              {[
                { year: '1999', detail: "Création d'OLGA à Casablanca par Mohammed Sefrioui" },
                { year: '2005', detail: "Ouverture de la boutique de Rabat, expansion nationale" },
                { year: '2015', detail: "Marrakech rejoint la famille OLGA" },
                { year: '2026', detail: "Collection Printemps-Été — 25 ans d'audace et d'élégance" },
              ].map((p) => (
                <div key={p.year} className="story-point">
                  <div className="story-year">{p.year}</div>
                  <div className="story-dot" />
                  <div className="story-detail">{p.detail}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={4} className="story-cta">
            <Link href="/a-propos" className="btn btn-terra">Découvrir notre histoire</Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
