'use client'
import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/product/Accordion'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'

const PRODUCT = {
  id: 'p1', slug: 'manteau-oversize-taupe', name: 'Manteau Oversize', nameEm: 'Taupe Camel',
  subtitle: 'Coupe ample structurée · Laine mélangée Marocaine', category: 'Prêt-à-porter',
  price: 1890, salePrice: 1490, season: 'Collection Automne — Hiver 2026',
  sizes: ['XS', 'S', 'M', 'L', 'XL'], unavailSizes: ['XS'],
  colors: [{ hex: '#C4A882', name: 'Taupe Camel' }, { hex: '#3D2E24', name: 'Espresso' }, { hex: '#8A9B8E', name: 'Sauge' }, { hex: '#1A1614', name: 'Charbon' }],
  images: ['https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=780','https://www.olgadsn.com/cdn/shop/files/a_28.png?v=1773411118&width=780','https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34.jpg?v=1776941720&width=780','https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34_1.jpg?v=1776945247&width=780'],
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  use(params)
  const [img, setImg] = useState(0)
  const [size, setSize] = useState('M')
  const [color, setColor] = useState(0)
  const [wished, setWished] = useState(false)
  const { addItem } = useCart()
  const { showToast } = useToast()

  function addToCart() {
    addItem({ product: { id: PRODUCT.id, slug: PRODUCT.slug, name: PRODUCT.name, category: PRODUCT.category, price: PRODUCT.price, salePrice: PRODUCT.salePrice, images: PRODUCT.images, sizes: PRODUCT.sizes, colors: PRODUCT.colors.map(c => c.hex) }, quantity: 1, selectedSize: size, selectedColor: PRODUCT.colors[color].name })
    showToast('✓ Ajouté au panier')
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Collections', href: '/collections' }, { label: PRODUCT.category, href: '/collections' }, { label: PRODUCT.name }]} />
      <div className="product-wrap">
        <div className="gallery">
          <div className="gallery-thumbs">
            {PRODUCT.images.map((src, i) => (
              <Image key={i} className={`thumb${i === img ? ' active' : ''}`} src={src} alt={`Vue ${i+1}`} width={80} height={100} style={{ objectFit:'cover', cursor:'pointer' }} onClick={() => setImg(i)} />
            ))}
          </div>
          <div className="gallery-main">
            <Image src={PRODUCT.images[img]} alt={PRODUCT.name} fill sizes="45vw" style={{ objectFit:'cover' }} priority />
            <div className="gallery-badge">Nouveau</div>
          </div>
        </div>
        <div className="product-info">
          <div className="product-over">{PRODUCT.season}</div>
          <h1 className="product-title">{PRODUCT.name}<br /><em>{PRODUCT.nameEm}</em></h1>
          <p className="product-subtitle">{PRODUCT.subtitle}</p>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'2rem', fontSize:'0.75rem', color:'var(--warm-gray)' }}>
            <span style={{ color:'var(--sand)', letterSpacing:2 }}>★★★★★</span><span>4.9</span><span style={{ color:'var(--mid-gray)' }}>(34 avis)</span>
          </div>
          <div className="product-price-row">
            <span className="price-main">{PRODUCT.salePrice?.toLocaleString('fr')} Dh</span>
            <span className="price-old">{PRODUCT.price.toLocaleString('fr')} Dh</span>
            <span className="price-save">−21%</span>
          </div>
          <div className="product-label">Couleur : <strong style={{ color:'var(--charcoal)' }}>{PRODUCT.colors[color].name}</strong></div>
          <div className="color-swatches">
            {PRODUCT.colors.map((c, i) => (
              <div key={c.name} className={`swatch${i === color ? ' active' : ''}`} style={{ background: c.hex }} title={c.name} onClick={() => setColor(i)} />
            ))}
          </div>
          <div className="product-label">Taille</div>
          <div className="sizes">
            {PRODUCT.sizes.map((s) => (
              <button key={s} className={`size-btn${s === size ? ' active' : ''}${PRODUCT.unavailSizes.includes(s) ? ' unavail' : ''}`} onClick={() => !PRODUCT.unavailSizes.includes(s) && setSize(s)}>{s}</button>
            ))}
          </div>
          <span style={{ fontSize:'0.68rem', color:'var(--mid-gray)', borderBottom:'1px solid var(--mid-gray)', cursor:'pointer', display:'block', width:'fit-content', marginBottom:'2rem' }}>Guide des tailles</span>
          <div className="product-actions">
            <button className="btn-add-cart" onClick={addToCart}>Ajouter au panier</button>
            <button style={{ width:54, height:54, border:'1px solid var(--ivory-deep)', background:'transparent', cursor:'pointer', fontSize:'1.2rem', color: wished ? 'var(--terra)' : 'var(--warm-gray)' }} onClick={() => setWished(w => !w)}>{wished ? '♥' : '♡'}</button>
          </div>
          <div className="shipping-pills">
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>Livraison offerte dès 999 Dh — <strong>2–4 jours ouvrés</strong></span></div>
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg><span>Échange gratuit en boutique sous 14 jours</span></div>
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Paiement 100% sécurisé — CMI Maroc</span></div>
          </div>
          <Accordion items={[
            { title: 'Description', content: <p>Un manteau oversize au tombé parfait, conçu pour sublimer la silhouette. Confectionné en laine mélangée d&apos;origine marocaine, il incarne l&apos;élégance discrète qui est la signature OLGA depuis 1999.</p> },
            { title: 'Composition & Matières', content: <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem' }}><li>— 70% Laine mélangée Marocaine</li><li>— 20% Polyester recyclé</li><li>— 10% Cachemire</li><li>— Doublure : 100% Soie naturelle</li></ul> },
            { title: 'Entretien', content: <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem' }}><li>— Nettoyage à sec recommandé</li><li>— Lavage à la main à 30°C si nécessaire</li><li>— Séchage à plat à l&apos;ombre</li></ul> },
            { title: 'Livraison & Retours', content: <p>Livraison standard : 2–4 jours ouvrés. Échange ou remboursement sous 14 jours en boutique ou par courrier.</p> },
          ]} />
        </div>
      </div>
      <section style={{ padding:'var(--section-pad)', borderTop:'1px solid var(--ivory-deep)' }}>
        <div className="sec-head"><div><div className="sec-over">Vous aimerez aussi</div><h2 className="sec-title">Pièces <em>assorties</em></h2></div><Link href="/collections" className="sec-link">Voir tout</Link></div>
      </section>
    </>
  )
}
