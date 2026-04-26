export function ValuesBar() {
  return (
    <div className="values">
      <div className="val r">
        <div className="val-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        <div className="val-title">Livraison offerte</div>
        <div className="val-desc">À partir de 999 Dh<br />sur toute la boutique</div>
      </div>
      <div className="val r d1">
        <div className="val-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg></div>
        <div className="val-title">Échange gratuit</div>
        <div className="val-desc">En magasin, sans frais<br />ni condition</div>
      </div>
      <div className="val r d2">
        <div className="val-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <div className="val-title">Qualité marocaine</div>
        <div className="val-desc">Matières soigneusement<br />sélectionnées depuis 1999</div>
      </div>
    </div>
  )
}
