'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

const FALLBACK: Product[] = [
  { id: '1', slug: 'sac-cabas-signature', name: 'Sac Cabas Signature', category: 'Sacs à main', price: 890, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_16_6dccc60d-59d2-4e62-9a8d-e9b15aa0a023.png?v=1761642435&width=500'], sizes: [], colors: [], badge: 'new' },
  { id: '2', slug: 'manteau-classique-creme', name: 'Manteau Classique Crème', category: 'Prêt-à-porter', price: 1200, images: ['https://www.olgadsn.com/cdn/shop/files/photo_2025-12-26_09-23-32_0819764f-b5e4-4c66-a7d8-b406cdd3c55f.jpg?v=1773329624&width=500'], sizes: ['S','M','L','XL'], colors: ['#F7F3EE'] },
  { id: '3', slug: 'basket-casual', name: 'Basket Casual', category: 'Chaussures', price: 600, salePrice: 480, images: ['https://www.olgadsn.com/cdn/shop/files/Design_sans_titre_2_1cdab00e-9f51-4d4a-8470-ef8dcbdf9ca9.png?v=1771504793&width=500'], sizes: ['38','39','40','41'], colors: [], badge: 'sale' },
  { id: '4', slug: 'chale-lycra-degrade', name: 'Châle Lycra Dégradé', category: 'Accessoires', price: 320, images: ['https://www.olgadsn.com/cdn/shop/files/IMG_7234.jpg?v=1730126211&width=500'], sizes: [], colors: [] },
]

function transformDbProduct(p: any): Product {
  const images = p.images?.map((img: any) => img.url) || []
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name || 'Sacs à main',
    price: p.compare_price || p.base_price,
    salePrice: p.compare_price && p.base_price < p.compare_price ? p.base_price : undefined,
    images: images.length > 0 ? images : ['https://www.olgadsn.com/cdn/shop/files/placeholder.jpg'],
    sizes: [],
    colors: [],
    badge: p.compare_price && p.base_price < p.compare_price ? 'sale' : p.is_featured ? 'new' : undefined,
    description: p.description,
    dbId: p.id,
  }
}

export function ProductsSection() {
  const [featured, setFeatured] = useState<Product[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.length > 0) setFeatured(data.map(transformDbProduct))
      })
      .catch(() => {})
  }, [])

  return (
    <section className="products">
      <div className="sec-head">
        <div>
          <ScrollReveal><div className="sec-over">Printemps-Été 2026</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="sec-title">Pièces <em>incontournables</em></h2></ScrollReveal>
        </div>
        <ScrollReveal delay={2}><Link href="/collections" className="sec-link">Voir tout →</Link></ScrollReveal>
      </div>
      <div className="pgrid">
        {featured.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
