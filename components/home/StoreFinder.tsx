import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STORES = [
  { city: 'Casa', cityRest: 'blanca', addr: 'Boulevard Zerktouni, Maarif\nCasablanca 20100', hours: 'Lun – Sam : 10h – 21h · Dim : 11h – 20h' },
  { city: 'Rabat', cityRest: '', addr: 'Avenue Mohammed V\nRabat 10000', hours: 'Lun – Sam : 10h – 20h30 · Dim : 11h – 19h' },
  { city: 'Marra', cityRest: 'kech', addr: 'Rue de la Liberté, Guéliz\nMarrakech 40000', hours: 'Lun – Sam : 10h – 21h · Dim : 11h – 20h' },
]

export function StoreFinder() {
  return (
    <section className="stores">
      <div className="sec-head">
        <div>
          <ScrollReveal><div className="sec-over">Boutiques</div></ScrollReveal>
          <ScrollReveal delay={1}><h2 className="sec-title">Nous <em>trouver</em></h2></ScrollReveal>
        </div>
      </div>
      <div className="stores-grid">
        {STORES.map((s, i) => (
          <ScrollReveal key={s.city} delay={(i as 0 | 1 | 2)} className="store-card">
            <div className="store-city"><em>{s.city}</em>{s.cityRest}</div>
            <div className="store-addr" style={{ whiteSpace: 'pre-line' }}>{s.addr}</div>
            <div className="store-hours">{s.hours}</div>
            <a href="#" className="store-link">Itinéraire</a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
