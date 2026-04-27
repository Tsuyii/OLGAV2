import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { label: 'Sacs', img: 'https://www.olgadsn.com/cdn/shop/collections/1_97db2d9f-2f24-4ccd-9c7c-a5e2c365bb02.png?v=1776946807&width=120' },
  { label: 'Prêt-à-porter', img: 'https://www.olgadsn.com/cdn/shop/collections/7_557d1dc6-5c3d-4b34-9450-9fd4d4e3c914.png?v=1776947621&width=120' },
  { label: 'Mocassins', img: 'https://www.olgadsn.com/cdn/shop/collections/6_ae4ae047-78fc-4909-80e8-cf82402452cd.png?v=1776947430&width=120' },
  { label: 'Chaussures', img: 'https://www.olgadsn.com/cdn/shop/collections/Post_instagram_Nouvelle_collection_bijoux_Modern_Simple_Beige_3.png?v=1776947355&width=120' },
  { label: 'Baskets', img: 'https://www.olgadsn.com/cdn/shop/collections/2_d1d6b60b-1a80-4ee5-ab3b-cb4eca1ea4e1.jpg?v=1770890818&width=120' },
  { label: 'Châles', img: 'https://www.olgadsn.com/cdn/shop/collections/10_970611ef-f8f9-4e92-a73c-173d4b942651.jpg?v=1770891333&width=120' },
  { label: 'Lunettes', img: 'https://www.olgadsn.com/cdn/shop/collections/11794359.png?v=1770900590&width=120' },
]

export function CategoryStrip() {
  return (
    <div className="cats">
      {categories.map((cat, i) => (
        <Link key={cat.label} href="/collections" className={`cat-item${i === 0 ? ' active' : ''}`}>
          <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
            <Image
              className="cat-img"
              src={cat.img}
              alt={cat.label}
              fill
              sizes="52px"
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <span className="cat-label">{cat.label}</span>
        </Link>
      ))}
    </div>
  )
}
