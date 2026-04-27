import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, getAllUsers, getAllVendors } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')

    switch (resource) {
      case 'orders':
        return NextResponse.json(await getAllOrders())
      case 'users':
        return NextResponse.json(await getAllUsers())
      case 'vendors':
        return NextResponse.json(await getAllVendors())
      default:
        return NextResponse.json({ error: 'Invalid resource' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}