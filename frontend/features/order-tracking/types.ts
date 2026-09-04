export type TrackingStatus = 'PLACED' | 'ACCEPTED' | 'PACKED' | 'IN_TRANSIT' | 'DELIVERED'

export type TrackingMilestone = {
    title: string
    detail: string
    time: string
    status: TrackingStatus
}

export type OrderTracking = {
    orderId: string
    productSummary: string
    origin: string
    destination: string
    eta: string
    carrier: string
    currentStatus: TrackingStatus
    progress: number
    distanceKm: number
    distanceCoveredKm: number
    nextStop: string
    lastUpdated: string
    checkpoints: Array<{ label: string; value: string }>
    milestones: TrackingMilestone[]
}
