import { createClient } from '@/lib/supabase/server'

export async function getProducts(options?: {
  categoryId?: string
  vendorId?: string
  status?: 'active'
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      vendor:vendor_profiles(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  if (options?.vendorId) {
    query = query.eq('vendor_id', options.vendorId)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      vendor:vendor_profiles(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data
}

export async function getCategories(parentId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, parent:categories!parent_id(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getUserCart(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*, images:product_images(*)),
      variant:product_variants(*)
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addToCart(userId: string, productId: string, variantId?: string, quantity = 1) {
  const supabase = await createClient()

  const existing = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('variant_id', variantId || null)
    .single()

  if (existing.data) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.data.quantity + quantity })
      .eq('id', existing.data.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, variant_id: variantId, quantity })
    if (error) throw error
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  if (quantity <= 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
    if (error) throw error
  }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
  if (error) throw error
}

export async function clearUserCart(userId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId)
  if (error) throw error
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      address:addresses(*)
    `)
    .eq('customer_id', userId)
    .order('placed_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getOrderById(orderId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*, product:products(*, images:product_images(*)),
      address:addresses(*),
      payment:payments(*)
    `)
    .eq('id', orderId)
    .eq('customer_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function createOrder(userId: string, addressId: string, discountId?: string) {
  const supabase = await createClient()

  const cartItems = await getUserCart(userId)
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const price = item.product?.base_price || 0
    return sum + price * item.quantity
  }, 0)

  const shippingFee = subtotal >= 999 ? 0 : 50
  const taxAmount = subtotal * 0.1
  let discountAmount = 0

  if (discountId) {
    const code = await getDiscountCode(discountId)
    if (code) {
      discountAmount = code.discount_type === 'percentage'
        ? subtotal * (code.discount_value / 100)
        : code.discount_value
    }
  }

  const total = subtotal + shippingFee + taxAmount - discountAmount

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id: userId,
      address_id: addressId,
      discount_id: discountId,
      subtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      tax_amount: taxAmount,
      total,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error

  for (const item of cartItems) {
    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      vendor_id: item.product?.vendor_id,
      product_name: item.product?.name,
      variant_info: item.variant?.attributes,
      quantity: item.quantity,
      unit_price: item.product?.base_price || 0,
      total_price: (item.product?.base_price || 0) * item.quantity,
    })
  }

  await clearUserCart(userId)

  return order
}

export async function getUserAddresses(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })

  if (error) throw error
  return data
}

export async function createAddress(userId: string, address: any) {
  const supabase = await createClient()

  if (address.isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDiscountCode(code: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error) throw error

  const now = new Date()
  if (data.starts_at && new Date(data.starts_at) > now) return null
  if (data.expires_at && new Date(data.expires_at) < now) return null
  if (data.max_uses && data.used_count >= data.max_uses) return null

  return data
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVendorProducts(vendorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVendorOrders(vendorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *,
      order:orders(*, customer:profiles(*)),
      product:products(*)
    `)
    .eq('vendor_id', vendorId)
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:profiles(*),
      address:addresses(*),
      items:order_items(*, product:products(*))
    `)
    .order('placed_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllVendors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select(`
      *,
      user:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}