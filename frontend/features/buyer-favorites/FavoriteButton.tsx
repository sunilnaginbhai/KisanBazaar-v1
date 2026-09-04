import { Heart } from 'lucide-react'
import { useState } from 'react'
import { getFavoriteProductIds, toggleFavoriteProduct } from './service'

export function FavoriteButton({ productId, onChange }: { productId: string; onChange?: (saved: boolean) => void }) {
    const [saved, setSaved] = useState(() => getFavoriteProductIds().includes(productId))
    return <button className={saved ? 'favorite-button saved' : 'favorite-button'} aria-label={saved ? 'Remove from favorites' : 'Save to favorites'} onClick={(event) => { event.preventDefault(); event.stopPropagation(); const next = !saved; toggleFavoriteProduct(productId); setSaved(next); onChange?.(next) }}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></button>
}
