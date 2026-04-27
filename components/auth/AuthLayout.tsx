'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './auth-ui.module.css'

export function AuthLayout({
  eyebrow,
  title,
  children,
  showGuestLink = false,
}: {
  eyebrow: string
  title: React.ReactNode
  children: React.ReactNode
  showGuestLink?: boolean
}) {
  return (
    <section className={styles.shell}>
      <aside className={styles.editorial} aria-hidden>
        <Image
          src="https://www.olgadsn.com/cdn/shop/files/WhatsApp_Image_2026-04-23_at_00.40.34_1.jpg?v=1776945247&width=1200"
          alt=""
          fill
          sizes="50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.editorialText}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>
            Quiet luxury
          </div>
          <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>
            Timeless pieces designed for modern women.
          </div>
        </div>
      </aside>

      <div className={styles.formSide}>
        <div className={styles.card}>
          <div className="sec-over">{eyebrow}</div>
          <h1 className="sec-title" style={{ marginBottom: '0.55rem' }}>
            {title}
          </h1>
          <div className={styles.proof}>
            <span className={styles.stars}>★★★★★</span>
            <span>Join 12,000+ women who love OLGA</span>
          </div>
          {children}
          {showGuestLink ? (
            <Link href="/collections" className={styles.guestLink}>
              Continue as guest →
            </Link>
          ) : null}
          <div className={styles.privacy}>🔒 Your data is secure. We never share your information.</div>
        </div>
      </div>
    </section>
  )
}
