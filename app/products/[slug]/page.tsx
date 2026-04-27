'use client'
import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/product/Accordion'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'

interface DbProduct {
  id: string
  slug: string
  name: string
  short_description: string | null
  description: string | null
  base_price: number
  compare_price: number | null
  status: string
  is_featured: boolean
  category: { name: string } | null
  images: { url: string; is_primary: boolean; sort_order: number }[]
  variants: { attributes: Record<string, string>; stock_qty: number; is_active: boolean }[]
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<DbProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [img, setImg] = useState(0)
  const [size, setSize] = useState('')
  const [wished, setWished] = useState(false)
  const { addItem } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && data.id) setProduct(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--warm-gray)', fontSize: '0.85rem', letterSpacing: 2 }}>Chargement...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <p style={{ color: 'var(--warm-gray)' }}>Produit introuvable.</p>
        <Link href="/collections" className="btn btn-outline">Voir les collections</Link>
      </div>
    )
  }

  const images = product.images
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(i => i.url)
  if (images.length === 0) images.push('https://www.olgadsn.com/cdn/shop/files/placeholder.jpg')

  const sizes = [...new Set(
    product.variants
      .filter(v => v.is_active)
      .map(v => v.attributes?.size)
      .filter(Boolean)
  )] as string[]

  const isSale = product.compare_price && product.base_price < product.compare_price
  const displayPrice = isSale ? product.compare_price! : product.base_price
  const salePrice = isSale ? product.base_price : undefined
  const discount = isSale
    ? Math.round((1 - product.base_price / product.compare_price!) * 100)
    : undefined

  const categoryName = product.category?.name || 'Collections'

  function addToCart() {
    addItem({
      product: {
        id: product!.id,
        slug: product!.slug,
        name: product!.name,
        category: categoryName,
        price: displayPrice,
        salePrice,
        images,
        sizes,
        colors: [],
      },
      quantity: 1,
      selectedSize: size || sizes[0] || '',
      selectedColor: '',
    })
    showToast('✓ Ajouté au panier')
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: categoryName, href: '/collections' },
        { label: product.name },
      ]} />
      <div className="product-wrap">
        <div className="gallery">
          <div className="gallery-thumbs">
            {images.map((src, i) => (
              <Image key={i} className={`thumb${i === img ? ' active' : ''}`} src={src} alt={`Vue ${i + 1}`} width={80} height={100} style={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => setImg(i)} />
            ))}
          </div>
          <div className="gallery-main">
            <Image src={images[img]} alt={product.name} fill sizes="45vw" style={{ objectFit: 'cover' }} priority />
            {isSale && <div className="gallery-badge">Solde</div>}
            {!isSale && product.is_featured && <div className="gallery-badge">Nouveau</div>}
          </div>
        </div>
        <div className="product-info">
          <div className="product-over">{categoryName}</div>
          <h1 className="product-title">{product.name}</h1>
          {product.short_description && <p className="product-subtitle">{product.short_description}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
            <span style={{ color: 'var(--sand)', letterSpacing: 2 }}>★★★★★</span><span>4.9</span><span style={{ color: 'var(--mid-gray)' }}>(34 avis)</span>
          </div>
          <div className="product-price-row">
            {isSale ? (
              <>
                <span className="price-main">{salePrice?.toLocaleString('fr')} Dh</span>
                <span className="price-old">{displayPrice.toLocaleString('fr')} Dh</span>
                <span className="price-save">−{discount}%</span>
              </>
            ) : (
              <span className="price-main">{displayPrice.toLocaleString('fr')} Dh</span>
            )}
          </div>
          {sizes.length > 0 && (
            <>
              <div className="product-label">Taille</div>
              <div className="sizes">
                {sizes.map((s) => (
                  <button key={s} className={`size-btn${(size || sizes[0]) === s ? ' active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--mid-gray)', borderBottom: '1px solid var(--mid-gray)', cursor: 'pointer', display: 'block', width: 'fit-content', marginBottom: '2rem' }}>Guide des tailles</span>
            </>
          )}
          <div className="product-actions">
            <button className="btn-add-cart" onClick={addToCart}>Ajouter au panier</button>
            <button style={{ width: 54, height: 54, border: '1px solid var(--ivory-deep)', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: wished ? 'var(--terra)' : 'var(--warm-gray)' }} onClick={() => setWished(w => !w)}>{wished ? '♥' : '♡'}</button>
          </div>
          <div className="shipping-pills">
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>Livraison offerte dès 999 Dh — <strong>2–4 jours ouvrés</strong></span></div>
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg><span>Échange gratuit en boutique sous 14 jours</span></div>
            <div className="ship-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Paiement 100% sécurisé — CMI Maroc</span></div>
          </div>
          <Accordion items={[
            { title: 'Description', content: <p>{product.description || product.short_description || 'Description non disponible.'}</p> },
            { title: 'Livraison & Retours', content: <p>Livraison standard : 2–4 jours ouvrés. Échange ou remboursement sous 14 jours en boutique ou par courrier.</p> },
          ]} />
        </div>
      </div>
      <section style={{ padding: 'var(--section-pad)', borderTop: '1px solid var(--ivory-deep)' }}>
        <div className="sec-head"><div><div className="sec-over">Vous aimerez aussi</div><h2 className="sec-title">Pièces <em>assorties</em></h2></div><Link href="/collections" className="sec-link">Voir tout</Link></div>
      </section>
    </>
  )
}
