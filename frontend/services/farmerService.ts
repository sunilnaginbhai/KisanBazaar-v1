import { products } from '../mock/products'
export const farmerService = { async getDashboard() { return { success: true, data: { products, earnings: 184000, pendingOrders: 8 }, message: 'Farmer dashboard loaded' } } }
