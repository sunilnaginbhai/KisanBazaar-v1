import { useEffect, useState } from 'react'
import { getFarmerInventory } from './services'
import type { InventorySummary } from './types'

export function useFarmerInventory() {
    const [data, setData] = useState<InventorySummary | null>(null)
    useEffect(() => {
        let active = true
        void getFarmerInventory().then((result) => { if (active) setData(result) })
        return () => { active = false }
    }, [])
    return { data, loading: !data }
}
