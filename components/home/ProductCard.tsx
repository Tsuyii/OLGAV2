'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
import { useState, useEffect, useRef } from 'react'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [wished, setWished] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('vis'); observer.unobserve(el) } },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes[0] ?? '',
      selectedColor: product.colors[0] ?? '',
    })
    showToast('✓ Ajouté au panier')
  }

  return (
    <div ref={cardRef} className="pcard r" onClick={() => router.push(`/products/${product.slug}`)}>
      <div className="pcard-img">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        {product.badge === 'new' && <div className="pbadge new">Nouveau</div>}
        {product.badge === 'sale' && <div className="pbadge sale">Solde</div>}
        <button
          className="pwish"
          onClick={(e) => { e.stopPropagation(); setWished((w) => !w) }}
          aria-label="Liste de souhaits"
          style={{ color: wished ? 'var(--terra)' : undefined }}
        >
          {wished ? '♥' : '♡'}
        </button>
        <div className="padd" onClick={handleAddToCart}>Ajouter au panier</div>
      </div>
      <div className="pcat">{product.category}</div>
      <div className="pname">{product.name}</div>
      <div className="pprice">
        {product.salePrice ? (
          <>
            <span className="pprice-sale">{product.salePrice} Dh</span>
            <span className="pprice-orig">{product.price} Dh</span>
          </>
        ) : (
          <>{product.price} Dh</>
        )}
      </div>
    </div>
  )
}
