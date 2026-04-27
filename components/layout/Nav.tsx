'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
<<<<<<< HEAD
import { useAuth } from '@/hooks/useAuth'
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
<<<<<<< HEAD
  const { isLoggedIn, profile } = useAuth()
  const firstName = profile?.first_name || 'there'
  const initials = profile?.avatar_initials || 'ME'
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd

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

        <Link className="nav-logo" href="/">
          <Image
            src="https://www.olgadsn.com/cdn/shop/files/Sans_titre-1_86801151-1295-41a8-adf4-a87fe7ccb143.png?v=1770892187"
            alt="OLGA"
            width={44}
            height={44}
            className="nav-logo-img"
            priority
          />
          <span className="nav-logo-wordmark">Olga</span>
        </Link>

        <ul className="nav-right">
<<<<<<< HEAD
          {isLoggedIn && (
            <li className="nav-text-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--mid-gray)' }}>Hello, {firstName}</span>
              <span
                aria-label="User initials"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: '#E8B4B8',
                  color: '#1A1A1A',
                  fontSize: '0.68rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}
              >
                {initials}
              </span>
            </li>
          )}
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
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
<<<<<<< HEAD
          {isLoggedIn ? <span style={{ fontSize: '0.85rem', color: 'var(--mid-gray)' }}>Hello, {firstName}</span> : null}
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
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
