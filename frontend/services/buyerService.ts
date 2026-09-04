import { products } from '../mock/products'
export const buyerService = { async getRecommendations() { return { success: true, data: products.slice(0, 4), message: 'Recommendations loaded' } } }
