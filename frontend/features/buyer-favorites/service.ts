import { products } from '../../mock/products'
import { readStorage, writeStorage } from '../../utils/storage'
import type { Product } from '../../mock/products'

const productsKey = 'direct-market-favorite-products'
const farmersKey = 'direct-market-favorite-farmers'

export function getFavoriteProductIds() { return readStorage<string[]>(productsKey, ['tomato-01', 'mango-01']) }
export function getFavoriteFarmerNames() { return readStorage<string[]>(farmersKey, ['Kaveri FPO']) }
export function toggleFavoriteProduct(id: string) {
    const next = getFavoriteProductIds().includes(id) ? getFavoriteProductIds().filter((item) => item !== id) : [...getFavoriteProductIds(), id]
    writeStorage(productsKey, next)
    return next
}
export function toggleFavoriteFarmer(name: string) {
    const next = getFavoriteFarmerNames().includes(name) ? getFavoriteFarmerNames().filter((item) => item !== name) : [...getFavoriteFarmerNames(), name]
    writeStorage(farmersKey, next)
    return next
}
export function getFavoriteProducts(): Product[] {
    const ids = getFavoriteProductIds()
    return products.filter((product) => ids.includes(product.id))
}
