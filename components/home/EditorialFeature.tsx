import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function EditorialFeature() {
  return (
    <section className="editorial">
      <div className="ed-text">
        <div>
          <ScrollReveal><div className="sec-over">Collection vedette</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="ed-h2">Douceur<br /><em>méditerranée</em></h2></ScrollReveal>
          <ScrollReveal delay={2}><p className="ed-desc">Couleurs fraîches, matières légères, coupes modernes — une allure féminine et tendance en toute simplicité.</p></ScrollReveal>
          <ScrollReveal delay={3}><Link href="/lookbook" className="ed-cta" data-cursor-hover>Explorer le lookbook</Link></ScrollReveal>
        </div>
        <ScrollReveal delay={4} className="ed-stats">
          <div className="stat"><div className="stat-n">25</div><div className="stat-l">Ans de<br />mode</div></div>
          <div className="stat"><div className="stat-n" style={{ color: 'var(--sage)' }}>SS</div><div className="stat-l">Saison<br />2026</div></div>
          <div className="stat"><div className="stat-n" style={{ color: 'var(--terra)', fontSize: '1.9rem' }}>3</div><div className="stat-l">Boutiques<br />au Maroc</div></div>
        </ScrollReveal>
      </div>
      <ScrollReveal className="ed-photos">
        <div className="ep">
          <Image src="https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34_1.jpg?v=1776945247&width=700" alt="Lookbook SS26" fill sizes="35vw" style={{ objectFit: 'cover' }} />
          <div className="ep-tag">Lookbook SS26</div>
        </div>
        <div className="ep">
          <Image src="https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_14_c6ced9d3-24f8-4e97-8a2e-f09cde789bb7.png?v=1761642468&width=450" alt="Sacs" fill sizes="17vw" style={{ objectFit: 'cover' }} />
          <div className="ep-tag">Sacs</div>
        </div>
        <div className="ep">
          <Image src="https://www.olgadsn.com/cdn/shop/files/a_28.png?v=1773411118&width=450" alt="Prêt-à-porter" fill sizes="17vw" style={{ objectFit: 'cover' }} />
          <div className="ep-tag">Prêt-à-porter</div>
        </div>
      </ScrollReveal>
    </section>
  )
}
