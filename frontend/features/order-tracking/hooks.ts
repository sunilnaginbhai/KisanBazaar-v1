import { useEffect, useState } from 'react'
import { getOrderTracking } from './services'
import type { OrderTracking } from './types'

export function useOrderTracking(orderId: string | undefined) {
    const [tracking, setTracking] = useState<OrderTracking | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        void getOrderTracking(orderId ?? '').then((result) => {
            if (active) {
                setTracking(result)
                setLoading(false)
            }
        })
        return () => { active = false }
    }, [orderId])

    return { tracking, loading }
}
