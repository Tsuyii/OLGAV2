import { NextRequest, NextResponse } from 'next/server'
import { getUserOrders, getOrderById, createOrder, getUserAddresses, createAddress } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (orderId) {
      const order = await getOrderById(orderId, user.id)
      return NextResponse.json(order)
    }

    const orders = await getUserOrders(user.id)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { address_id, discount_id, use_new_address, new_address } = await request.json()

    let addressId = address_id

    if (use_new_address && new_address) {
      const address = await createAddress(user.id, new_address)
      addressId = address.id
    }

    const order = await createOrder(user.id, addressId, discount_id)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}