'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/types'

const STATIC_PRODUCTS: Product[] = [
  { id: '1', slug: 'sac-cabas-signature', name: 'Sac Cabas Signature', category: 'Sacs à main', price: 890, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_16_6dccc60d-59d2-4e62-9a8d-e9b15aa0a023.png?v=1761642435&width=500'], sizes: [], colors: [], badge: 'new' },
  { id: '2', slug: 'sac-bandouliere-cuir', name: 'Sac Bandoulière Cuir', category: 'Sacs à main', price: 750, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_14_c6ced9d3-24f8-4e97-8a2e-f09cde789bb7.png?v=1761642468&width=500'], sizes: [], colors: [] },
  { id: '3', slug: 'manteau-classique', name: 'Manteau Classique', category: 'Prêt-à-porter', price: 1200, images: ['https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=500'], sizes: ['S','M','L','XL'], colors: [] },
  { id: '4', slug: 'manteau-confort-ss26', name: 'Manteau Confort SS26', category: 'Prêt-à-porter', price: 980, images: ['https://www.olgadsn.com/cdn/shop/files/a_28.png?v=1773411118&width=500'], sizes: ['S','M','L'], colors: [], badge: 'new' },
  { id: '5', slug: 'basket-casual', name: 'Basket Casual', category: 'Chaussures', price: 600, salePrice: 480, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_2_1cdab00e-9f51-4d4a-8470-ef8dcbdf9ca9.png?v=1771504793&width=500'], sizes: ['38','39','40','41'], colors: [], badge: 'sale' },
  { id: '6', slug: 'basket-elegance', name: 'Basket Élégance', category: 'Chaussures', price: 560, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_3_df643f40-bbaa-4c7b-9d40-89ab3fd185b6.png?v=1771504827&width=500'], sizes: ['38','39','40'], colors: [] },
  { id: '7', slug: 'chale-lycra-degrade', name: 'Châle Lycra Dégradé', category: 'Accessoires', price: 320, images: ['https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=500'], sizes: [], colors: [] },
  { id: '8', slug: 'cabas-printemps', name: 'Cabas Printemps', category: 'Sacs à main', price: 820, images: ['https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-23.jpg?v=1777108063&width=500'], sizes: [], colors: [], badge: 'new' },
  { id: '9', slug: 'sac-tote-ete', name: 'Sac Tote Été', category: 'Sacs à main', price: 680, images: ['https://www.olgadsn.com/cdn/shop/files/photo_2026-04-25_09-34-15.jpg?v=1777108063&width=500'], sizes: [], colors: [] },
  { id: '10', slug: 'sac-seau-camel', name: 'Sac Seau Camel', category: 'Sacs à main', price: 700, salePrice: 595, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_15_622874cb-4e7a-46ce-9a6e-9614a9a6ada4.png?v=1761642400&width=500'], sizes: [], colors: [], badge: 'sale' },
  { id: '11', slug: 'manteau-confort-ecru', name: 'Manteau Confort Écru', category: 'Prêt-à-porter', price: 1100, images: ['https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-24_9a026f90-531b-4d9f-9b6c-825759612386.jpg?v=1773329709&width=500'], sizes: ['S','M','L'], colors: [] },
  { id: '12', slug: 'valise-elegance-2026', name: 'Valise Élégance 2026', category: 'Valises', price: 2400, images: ['https://www.olgadsn.com/cdn/shop/files/Gemini_Generated_Image_miw8x3miw8x3miw8.png?v=1776941743&width=500'], sizes: [], colors: [], badge: 'new' },
]

const CATS = ['Tout', 'Nouveautés', 'Sacs', 'Prêt-à-porter', 'Chaussures', 'Accessoires', 'Promotions']

function transformDbProduct(p: any): Product {
  const images = p.images?.map((img: any) => img.url) || []
  const hasVariants = p.variants && p.variants.length > 0
  const sizes: string[] = hasVariants ? [...new Set(p.variants.map((v: any) => v.attributes?.size).filter(Boolean))] as string[] : []
  const colors: string[] = hasVariants ? [...new Set(p.variants.map((v: any) => v.attributes?.color).filter(Boolean))] as string[] : []
  
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name || 'Sacs à main',
    price: p.compare_price || p.base_price,
    salePrice: p.compare_price && p.base_price < p.compare_price ? p.base_price : undefined,
    images: images.length > 0 ? images : ['https://www.olgadsn.com/cdn/shop/files/placeholder.jpg'],
    sizes,
    colors,
    badge: p.is_featured ? 'new' : undefined,
    description: p.description,
    dbId: p.id,
    vendorId: p.vendor_id,
    categoryId: p.category_id,
    basePrice: p.base_price,
    comparePrice: p.compare_price,
    sku: p.sku,
    stockQty: p.stock_qty,
    status: p.status,
  }
}

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState('Tout')
  const [sort, setSort] = useState('Meilleures ventes')
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addItem } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const transformed = data.map(transformDbProduct)
            setProducts(transformed)
          }
        }
      } catch (err) {
        console.log('Using static products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = activeTab === 'Tout' 
    ? products 
    : products.filter(p => {
        if (activeTab === 'Nouveautés') return p.badge === 'new'
        if (activeTab === 'Promotions') return p.salePrice !== undefined
        return p.category.toLowerCase().includes(activeTab.toLowerCase())
      })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'Prix croissant') return a.price - b.price
    if (sort === 'Prix décroissant') return b.price - a.price
    return 0
  })

  function handleAddToCart(e: React.MouseEvent, p: Product) {
    e.stopPropagation()
    addItem({ product: p, quantity: 1, selectedSize: p.sizes[0] ?? '', selectedColor: p.colors[0] ?? '' })
    showToast('✓ Ajouté au panier')
  }

  async function handleWishlist(e: React.MouseEvent, productId: string) {
    e.stopPropagation()
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })
      showToast('✓ Ajouté à la wishlist')
    } catch (err) {
      showToast('Connectez-vous pourwishlister')
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-over">Printemps · Été 2026</div>
        <h1 className="page-hero-h1">Nos <em>collections</em></h1>
        <p className="page-hero-p">Des pièces conçues pour la femme moderne — élégantes, pratiques, intemporelles.</p>
      </div>
      <div className="collection-layout">
        <aside className="filters">
          <div className="filter-title">Catégorie</div>
          <div className="filter-tags">
            {['Tout (42)', 'Sacs à main (14)', 'Prêt-à-porter (12)', 'Chaussures (8)', 'Accessoires (6)', 'Valises (2)'].map((t) => (
              <div key={t} className="filter-tag">{t}</div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--ivory-deep)', margin: '1.5rem 0 0' }} />
          <div className="filter-title">Prix</div>
          <div className="filter-tags">
            {['Moins de 300 Dh', '300 – 700 Dh', '700 – 1200 Dh', 'Plus de 1200 Dh'].map((t) => (
              <div key={t} className="filter-tag">{t}</div>
            ))}
          </div>
        </aside>
        <div className="collection-products">
          <div className="cat-tabs">
            {CATS.map((c) => (
              <div key={c} className={`cat-tab${activeTab === c ? ' active' : ''}`} onClick={() => setActiveTab(c)}>{c}</div>
            ))}
          </div>
          <div className="collection-top">
            <span className="col-count">{loading ? '...' : `${sortedProducts.length} produits`}</span>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option>Meilleures ventes</option>
              <option>Nouveautés</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>
          <div className="pgrid">
            {sortedProducts.map((p) => (
              <div key={p.id} className="pcard r" onClick={() => router.push(`/products/${p.slug}`)}>
                <div className="pcard-img">
                  <Image src={p.images[0]} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                  {p.badge === 'new' && <div className="pbadge new">Nouveau</div>}
                  {p.badge === 'sale' && <div className="pbadge sale">Solde</div>}
                  <div className="pwish" onClick={(e) => handleWishlist(e, p.dbId || p.id)}>♡</div>
                  <div className="padd" onClick={(e) => handleAddToCart(e, p)}>Ajouter au panier</div>
                </div>
                <div className="pcat">{p.category}</div>
                <div className="pname">{p.name}</div>
                <div className="pprice">
                  {p.salePrice ? <><span className="pprice-sale">{p.salePrice} Dh</span><span className="pprice-orig">{p.price} Dh</span></> : <>{p.price} Dh</>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--ivory-deep)' }}>
            <button className="btn btn-outline">Charger plus</button>
          </div>
        </div>
      </div>
    </>
  )
}