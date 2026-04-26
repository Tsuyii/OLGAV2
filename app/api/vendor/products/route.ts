import { NextRequest, NextResponse } from 'next/server'
import { getVendorProducts } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: vendor } = await supabase
      .from('vendor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const products = await getVendorProducts(vendor.id)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Vendor products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}