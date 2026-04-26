import Link from 'next/link'

export function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <span className="foot-logo">Olga</span>
          <div className="foot-since">Depuis 1999</div>
          <p className="foot-tagline">
            Mode féminine marocaine. Des pièces pensées pour sublimer chaque femme, du quotidien à l&apos;exceptionnel.
          </p>
        </div>
        <div>
          <div className="foot-col-title">Collections</div>
          <ul className="foot-links">
            <li><Link href="/collections">Prêt-à-porter</Link></li>
            <li><Link href="/collections">Chaussures</Link></li>
            <li><Link href="/collections">Sacs &amp; Maroquinerie</Link></li>
            <li><Link href="/collections">Accessoires</Link></li>
            <li><Link href="/promotions">Promotions</Link></li>
          </ul>
        </div>
        <div>
          <div className="foot-col-title">Informations</div>
          <ul className="foot-links">
            <li><Link href="/a-propos">Notre histoire</Link></li>
            <li><Link href="/livraison">Livraison &amp; Retours</Link></li>
            <li><Link href="/confidentialite">Politique de confidentialité</Link></li>
            <li><Link href="/cgv">Conditions d&apos;utilisation</Link></li>
          </ul>
        </div>
        <div>
          <div className="foot-col-title">Nous suivre</div>
          <ul className="foot-links">
            <li><a href="https://instagram.com/olgadsn" target="_blank" rel="noopener noreferrer">Instagram @olgadsn</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">WhatsApp</a></li>
            <li><Link href="/a-propos#boutiques">Nos boutiques</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span className="foot-copy">© 2026 OLGA DSN MAROC. Tous droits réservés.</span>
        <div className="foot-legal">
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cgv">CGV</Link>
          <Link href="/remboursement">Remboursement</Link>
        </div>
      </div>
    </footer>
  )
}
