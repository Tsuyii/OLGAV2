'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const active = (href: string) => pathname === href ? 'active' : undefined

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <ul className="nav-left">
          <li><Link href="/" className={active('/')}>Nouveautés</Link></li>
          <li><Link href="/collections" className={active('/collections')}>Collections</Link></li>
          <li><Link href="/lookbook" className={active('/lookbook')}>Lookbook</Link></li>
        </ul>

        <Link className="nav-logo" href="/">Olga</Link>

        <ul className="nav-right">
          <li><Link href="/a-propos" className={active('/a-propos')}>Notre histoire</Link></li>
          <li><Link href="/promotions">Promotions</Link></li>
          <li>
            <Link href="/compte" style={{ position: 'relative' }}>
              Compte
            </Link>
          </li>
          <li>
            <Link href="/panier" style={{ position: 'relative' }}>
              Panier{totalItems > 0 && <span className="nav-cart-count"> ({totalItems})</span>}
            </Link>
          </li>
        </ul>

        <button
          className={`nav-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)} />
        <nav className="mobile-nav-drawer">
          <Link href="/">Accueil</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/a-propos">Notre histoire</Link>
          <Link href="/promotions">Promotions</Link>
          <Link href="/auth/login">Mon compte</Link>
        </nav>
      </div>
    </>
  )
}
