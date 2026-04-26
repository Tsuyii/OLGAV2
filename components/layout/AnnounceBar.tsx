const messages = [
  'Livraison offerte dès 999 Dh',
  '·',
  'Échange gratuit en magasin',
  '·',
  'Collection Printemps-Été 2026 disponible',
  '·',
  'Livraison offerte dès 999 Dh',
  '·',
  'Échange gratuit en magasin',
  '·',
  'Collection Printemps-Été 2026 disponible',
]

export function AnnounceBar() {
  return (
    <div className="announce">
      <span className="announce-track">
        {messages.map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </span>
    </div>
  )
}
