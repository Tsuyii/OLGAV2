'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/context/ToastContext'
<<<<<<< HEAD
import { useAuth } from '@/hooks/useAuth'
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart()
  const { showToast } = useToast()
<<<<<<< HEAD
  const { profile } = useAuth()
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (items.length > 0) {
      syncToBackend()
    }
  }, [items.length])

  async function syncToBackend() {
    const userItems = items.filter(i => i.product.dbId)
    if (userItems.length === 0) return
    
    setSyncing(true)
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: userItems.map(i => ({
            product_id: i.product.dbId,
            quantity: i.quantity,
          })),
        }),
      })
    } catch (err) {
      console.log('Cart sync failed')
    } finally {
      setSyncing(false)
    }
  }

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        showToast('Erreur: ' + (data.error || 'Réessayez'))
      }
    } catch (err) {
      showToast('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <div className="page-hero">
          <h1 className="page-hero-h1">Votre <em>panier</em></h1>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--warm-gray)', marginBottom: '2rem' }}>Votre panier est vide</p>
          <Link href="/collections" className="btn">Continuer vos achats</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="page-hero">
        <h1 className="page-hero-h1">Votre <em>panier</em></h1>
<<<<<<< HEAD
        {profile?.first_name ? (
          <p style={{ marginTop: '0.8rem', color: 'var(--warm-gray)', fontSize: '0.85rem' }}>
            Thank you, {profile.first_name}!
          </p>
        ) : null}
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
              <div className="cart-item-img">
                <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-variant">
                  {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                  {item.selectedColor && <span>Couleur: {item.selectedColor}</span>}
                </div>
                <div className="cart-item-price">
                  {(item.product.salePrice ?? item.product.price).toLocaleString('fr')} Dh
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="cart-qty">
                  <button onClick={() => {
                    if (item.quantity > 1) {
                      updateQty(item.product.id, item.quantity - 1)
                    } else {
                      removeItem(item.product.id)
                    }
                  }}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-remove" onClick={() => removeItem(item.product.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Sous-total</span>
            <span>{totalPrice.toLocaleString('fr')} Dh</span>
          </div>
          <div className="cart-summary-row">
            <span>Livraison</span>
            <span>{totalPrice >= 999 ? 'Offerte' : '50 Dh'}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--ivory-deep)', margin: '1rem 0' }} />
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>{(totalPrice + (totalPrice >= 999 ? 0 : 50)).toLocaleString('fr')} Dh</span>
          </div>
          <button 
            className="btn cart-checkout" 
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? '...' : 'Passer la commande'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--mid-gray)', textAlign: 'center', marginTop: '1rem' }}>
            Paiement sécurisé · CMI Maroc
          </p>
        </div>
      </div>
    </>
  )
}