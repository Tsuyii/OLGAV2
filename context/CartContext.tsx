'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(
        (i) =>
          i.product.id === action.item.product.id &&
          i.selectedSize === action.item.selectedSize &&
          i.selectedColor === action.item.selectedColor
      )
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.item.product.id &&
            i.selectedSize === action.item.selectedSize &&
            i.selectedColor === action.item.selectedColor
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem: (item) => dispatch({ type: 'ADD', item }),
        removeItem: (id) => dispatch({ type: 'REMOVE', productId: id }),
        updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', productId: id, quantity: qty }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
