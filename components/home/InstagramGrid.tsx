import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const POSTS = [
  { src: 'https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34.jpg?v=1776941720&width=400', shop: true },
  { src: 'https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34_1.jpg?v=1776945247&width=400', shop: false },
  { src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_14_c6ced9d3-24f8-4e97-8a2e-f09cde789bb7.png?v=1761642468&width=400', shop: true },
  { src: 'https://www.olgadsn.com/cdn/shop/files/a_28.png?v=1773411118&width=400', shop: false },
  { src: 'https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_2_1cdab00e-9f51-4d4a-8470-ef8dcbdf9ca9.png?v=1771504793&width=400', shop: true },
  { src: 'https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=400', shop: false },
]

export function InstagramGrid() {
  return (
    <section className="community">
      <div className="sec-head">
        <div>
          <ScrollReveal><div className="sec-over">120K+ followers</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="sec-title">La communauté <em>Olga</em></h2></ScrollReveal>
        </div>
        <ScrollReveal delay={2}><a href="https://instagram.com/olgadsn" target="_blank" rel="noopener noreferrer" className="sec-link">@olgadsn →</a></ScrollReveal>
      </div>
      <ScrollReveal className="insta-grid">
        {POSTS.map((post, i) => (
          <div key={i} className="insta-cell">
            <Image src={post.src} alt="OLGA Instagram" fill sizes="17vw" style={{ objectFit: 'cover' }} />
            <div className="insta-cell-overlay"><span className="insta-icon">♡</span></div>
            {post.shop && <div className="insta-shop-tag">Shop</div>}
          </div>
        ))}
      </ScrollReveal>
      <div className="community-footer r">
        <span className="community-handle">@olgadsn</span>
        <span className="community-sub">Partagez votre style avec #OlgaDSN</span>
      </div>
    </section>
  )
}
