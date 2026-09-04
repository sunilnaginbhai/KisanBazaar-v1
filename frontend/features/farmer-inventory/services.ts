import { products } from '../../mock/products'
import type { InventorySummary } from './types'

export async function getFarmerInventory(): Promise<InventorySummary> {
    await new Promise((resolve) => window.setTimeout(resolve, 160))
    const items = products.slice(0, 7).map((product, index) => ({
        product,
        reserved: [380, 120, 240, 84, 1120, 64, 190][index],
        threshold: [500, 180, 300, 800, 700, 1000, 250][index],
        updated: index % 2 === 0 ? 'Updated today' : 'Updated yesterday',
    }))
    return {
        items,
        totalAvailable: items.reduce((sum, item) => sum + item.product.quantity, 0),
        totalReserved: items.reduce((sum, item) => sum + item.reserved, 0),
        lowStockCount: items.filter((item) => item.product.quantity < item.threshold).length,
    }
}
