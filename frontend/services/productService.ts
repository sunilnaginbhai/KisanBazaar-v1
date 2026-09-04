import type { Product } from '../mock/products'
import { products } from '../mock/products'
import type { ApiResponse } from '../types/api'

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const productService = {
    async getProducts(): Promise<ApiResponse<Product[]>> {
        await wait(420)
        return { success: true, data: products, message: 'Products loaded successfully' }
    },
    async getProductById(id: string): Promise<ApiResponse<Product | null>> {
        await wait(360)
        const product = products.find((item) => item.id === id) ?? null
        return { success: Boolean(product), data: product, message: product ? 'Product loaded successfully' : 'Product not found' }
    },
}
