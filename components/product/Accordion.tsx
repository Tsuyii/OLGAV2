'use client'
import { useState } from 'react'

interface AccordionItem { title: string; content: React.ReactNode }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number>(0)
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className="acc-item">
          <button className="acc-trigger" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {item.title}<span className="acc-icon" />
          </button>
          <div className={`acc-body${open === i ? ' open' : ''}`}>
            <div className="acc-content">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
