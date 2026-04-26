import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductBySlug, getCategories, getFeaturedProducts } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (slug) {
      const product = await getProductBySlug(slug)
      return NextResponse.json(product)
    }

    if (featured === 'true') {
      const products = await getFeaturedProducts(limit)
      return NextResponse.json(products)
    }

    const products = await getProducts({
      categoryId: category || undefined,
      limit,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}