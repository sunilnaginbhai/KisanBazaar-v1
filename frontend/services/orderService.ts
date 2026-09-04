import { readStorage, writeStorage } from '../utils/storage'

type Order = { id: string; status: string; total: number }
const key = 'direct-market-orders'
export const orderService = {
    async getOrders() { return { success: true, data: readStorage<Order[]>(key, []), message: 'Orders loaded successfully' } },
    async createOrder(order: Order) { const orders = readStorage<Order[]>(key, []); writeStorage(key, [...orders, order]); return { success: true, data: order, message: 'Order created successfully' } },
}
