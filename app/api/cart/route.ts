import { NextRequest, NextResponse } from 'next/server'
import { getUserCart, addToCart, updateCartQuantity, removeFromCart, clearUserCart } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await getUserCart(user.id)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product_id, variant_id, quantity } = await request.json()

    await addToCart(user.id, product_id, variant_id, quantity || 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cart_item_id, quantity } = await request.json()

    await updateCartQuantity(cart_item_id, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('item_id')
    const clear = searchParams.get('clear')

    if (clear === 'true') {
      await clearUserCart(user.id)
    } else if (itemId) {
      await removeFromCart(itemId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}