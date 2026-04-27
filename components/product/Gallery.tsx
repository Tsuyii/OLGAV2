'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props { images: string[]; badge?: string }

export function Gallery({ images, badge }: Props) {
  const [active, setActive] = useState(0)
  return (
    <div className="gallery">
      <div className="gallery-thumbs">
        {images.map((src, i) => (
          <Image key={i} className={`thumb${i === active ? ' active' : ''}`} src={src} alt={`Vue ${i + 1}`} width={80} height={100} style={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => setActive(i)} />
        ))}
      </div>
      <div className="gallery-main">
        <Image className="gallery-main-img active" src={images[active]} alt="Product" fill sizes="45vw" style={{ objectFit: 'cover' }} priority />
        {badge && <div className="gallery-badge">{badge}</div>}
      </div>
    </div>
  )
}
