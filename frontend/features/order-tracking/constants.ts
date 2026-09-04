import type { TrackingStatus } from './types'

export const trackingStatusLabels: Record<TrackingStatus, string> = {
    PLACED: 'Order placed',
    ACCEPTED: 'Farmer accepted',
    PACKED: 'Packed at source',
    IN_TRANSIT: 'In transit',
    DELIVERED: 'Delivered',
}
