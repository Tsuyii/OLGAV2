export type UserRole = 'customer' | 'vendor' | 'admin'
export type ProductStatus = 'draft' | 'active' | 'archived'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type VendorStatus = 'pending' | 'active' | 'suspended'

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: number
  salePrice?: number
  images: string[]
  sizes: string[]
  colors: string[]
  badge?: 'new' | 'sale'
  description?: string
  composition?: string
  care?: string
  dbId?: string
  vendorId?: string
  categoryId?: string
  basePrice?: number
  comparePrice?: number
  sku?: string
  stockQty?: number
  status?: ProductStatus
  isFeatured?: boolean
  tags?: string[]
  shortDesc?: string
  metaTitle?: string
  metaDescription?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface Store {
  city: string
  address: string
  hours: string
  phone: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface Profile {
  id: string
  role: UserRole
  fullName: string | null
  avatarUrl: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface VendorProfile {
  id: string
  userId: string
  storeName: string
  storeSlug: string
  description: string | null
  logoUrl: string | null
  status: VendorStatus
  commissionRate: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  parentId: string | null
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string | null
  attributes: Record<string, string>
  priceModifier: number
  stockQty: number
  isActive: boolean
}

export interface Order {
  id: string
  customerId: string
  addressId: string | null
  discountId: string | null
  status: OrderStatus
  subtotal: number
  discountAmount: number
  shippingFee: number
  taxAmount: number
  total: number
  currency: string
  notes: string | null
  trackingNumber: string | null
  placedAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string | null
  vendorId: string
  productName: string
  variantInfo: Record<string, unknown> | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Address {
  id: string
  userId: string
  label: string
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string | null
  country: string
  phone: string | null
  isDefault: boolean
}

export interface CartItemType {
  id: string
  userId: string
  productId: string
  variantId: string | null
  quantity: number
  addedAt: string
  product?: Product
  variant?: ProductVariant
}

export interface Payment {
  id: string
  orderId: string
  provider: string
  status: PaymentStatus
  amount: number
  currency: string
  providerRef: string | null
  paidAt: string | null
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string | null
  body: string | null
  isVerified: boolean
  isApproved: boolean
  createdAt: string
}

export interface DiscountCode {
  id: string
  code: string
  description: string | null
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number | null
  maxUses: number | null
  usedCount: number
  startsAt: string | null
  expiresAt: string | null
  isActive: boolean
}
