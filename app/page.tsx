import { Hero } from '@/components/home/Hero'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { EditorialFeature } from '@/components/home/EditorialFeature'
import { ProductsSection } from '@/components/home/ProductsSection'
import { FullBleedBanner } from '@/components/home/FullBleedBanner'
import { BrandStory } from '@/components/home/BrandStory'
import { InstagramGrid } from '@/components/home/InstagramGrid'
import { StoreFinder } from '@/components/home/StoreFinder'
import { Promotions } from '@/components/home/Promotions'
import { ValuesBar } from '@/components/home/ValuesBar'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <EditorialFeature />
      <ProductsSection />
      <FullBleedBanner />
      <BrandStory />
      <InstagramGrid />
      <StoreFinder />
      <Promotions />
      <ValuesBar />
      <Newsletter />
    </>
  )
}
