import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getUserCart, getDiscountCode } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { discount_code, success_url, cancel_url } = await request.json()

    const cartItems = await getUserCart(user.id)

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lineItems = cartItems.map((item: any) => ({
      name: (item.product?.name as string) || 'Product',
      amount: (item.product?.base_price as number) || 0,
      quantity: item.quantity,
    }))

    let discountAmount = 0
    if (discount_code) {
      const code = await getDiscountCode(discount_code)
      if (code) {
        const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.amount * item.quantity, 0)
        discountAmount = code.discountType === 'percentage'
          ? subtotal * (code.discountValue / 100)
          : code.discountValue

        lineItems.push({
          name: `Discount: ${discount_code}`,
          amount: -discountAmount,
          quantity: 1,
        })
      }
    }

    const session = await createCheckoutSession({
      lineItems,
      successUrl: success_url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/checkout/success`,
      cancelUrl: cancel_url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/cart`,
      customerId: user.id,
      metadata: {
        userId: user.id,
        discountCode: discount_code || '',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}