'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { LogoutButton } from './LogoutButton'

interface Order {
  id: string
  status: string
  total: number
  placed_at: string
  items: any[]
}

export default function ComptePage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)

      try {
        const res = await fetch('/api/orders')
        if (res.ok) {
          const data = await res.json()
          setOrders(data || [])
        }
      } catch (err) {
        console.log('No orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé',
  }

  return (
    <div style={{ maxWidth: 800, margin: '8rem auto', padding: '0 1.5rem' }}>
      <div className="sec-over">Mon espace</div>
      <h1 className="sec-title" style={{ marginBottom: '0.5rem' }}>Bonjour, <em>{user?.email}</em></h1>
      <p style={{ color: 'var(--warm-gray)', fontSize: '0.85rem', marginBottom: '3rem' }}>Bienvenue dans votre espace personnel OLGA DSN.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <Link href="/compte/commandes" style={{ padding: '2rem', background: 'var(--ivory-warm)', border: '1px solid var(--ivory-deep)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300 }}>Mes commandes</div>
        </Link>
        <Link href="/compte/adresses" style={{ padding: '2rem', background: 'var(--ivory-warm)', border: '1px solid var(--ivory-deep)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300 }}>Mes adresses</div>
        </Link>
        <Link href="/compte/wishlist" style={{ padding: '2rem', background: 'var(--ivory-warm)', border: '1px solid var(--ivory-deep)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300 }}>Ma wishlist</div>
        </Link>
        <Link href="/compte/profil" style={{ padding: '2rem', background: 'var(--ivory-warm)', border: '1px solid var(--ivory-deep)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300 }}>Mes informations</div>
        </Link>
      </div>

      {!loading && orders.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '1rem' }}>Commandes récentes</h2>
          {orders.slice(0, 3).map(order => (
            <div key={order.id} style={{ padding: '1rem', border: '1px solid var(--ivory-deep)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Commande #{order.id.slice(0, 8)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>
                  {new Date(order.placed_at).toLocaleDateString('fr')} · {order.items?.length || 0} article(s)
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 500 }}>{order.total?.toLocaleString('fr')} Dh</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sage)' }}>{statusLabels[order.status] || order.status}</div>
              </div>
            </div>
          ))}
          {orders.length > 3 && (
            <Link href="/compte/commandes" style={{ fontSize: '0.85rem', color: 'var(--sage)', display: 'block', marginTop: '1rem' }}>
              Voir toutes les commandes →
            </Link>
          )}
        </div>
      )}

      <LogoutButton />
    </div>
  )
}