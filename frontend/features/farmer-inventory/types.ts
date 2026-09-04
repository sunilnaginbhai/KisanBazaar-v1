import type { Product } from '../../mock/products'

export type InventoryRecord = {
    product: Product
    reserved: number
    threshold: number
    updated: string
}

export type InventorySummary = {
    items: InventoryRecord[]
    totalAvailable: number
    totalReserved: number
    lowStockCount: number
}
