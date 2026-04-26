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
          <li className="nav-text-item"><Link href="/a-propos" className={active('/a-propos')}>Notre histoire</Link></li>
          <li className="nav-text-item"><Link href="/promotions">Promotions</Link></li>
          <li>
            <Link href="/compte" className="nav-icon-btn" aria-label="Mon compte">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </li>
          <li>
            <Link href="/panier" className="nav-icon-btn" aria-label="Panier" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
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

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)} />
        <nav className="mobile-nav-drawer">
          <Link href="/">Accueil</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/a-propos">Notre histoire</Link>
          <Link href="/promotions">Promotions</Link>
          <Link href="/compte">Mon compte</Link>
          <Link href="/panier">Panier{totalItems > 0 ? ` (${totalItems})` : ''}</Link>
        </nav>
      </div>
    </>
  )
}
