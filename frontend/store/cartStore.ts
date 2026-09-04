import { create } from 'zustand'
import type { Product } from '../mock/products'

type CartLine = { product: Product; quantity: number }

type CartState = {
    items: CartLine[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (product) => set((state) => ({ items: [...state.items, { product, quantity: 1 }] })),
    removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
    clear: () => set({ items: [] }),
}))
