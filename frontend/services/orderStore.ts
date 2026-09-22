export type AdminOrderItem = {
    productId: string
    name: string
    quantity: number
    unit: string
    unitPrice: number
}

export type AdminOrder = {
    id: string
    customerName: string
    customerEmail: string
    customerPhone: string
    items: AdminOrderItem[]
    total: number
    status: 'Confirmed'
    createdAt: string
}

const orderStorageKey = 'direct-market-orders'

export function getStoredOrders(): AdminOrder[] {
    try {
        const stored = JSON.parse(localStorage.getItem(orderStorageKey) ?? '[]') as AdminOrder[]
        return Array.isArray(stored) ? stored : []
    } catch {
        return []
    }
}

export function saveOrder(order: AdminOrder) {
    localStorage.setItem(orderStorageKey, JSON.stringify([order, ...getStoredOrders()]))
}