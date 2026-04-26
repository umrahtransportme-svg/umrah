'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CartItem } from '@/types'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartId'>) => void
  removeItem: (cartId: string) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ut_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ut_cart', JSON.stringify(items))
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'cartId'>) => {
    const cartId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setItems((prev) => [...prev, { ...item, cartId }])
  }, [])

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('ut_cart')
  }, [])

  const total = items.reduce((s, i) => s + i.price, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
