import type { OrderTracking } from './types'

const trackingData: Record<string, OrderTracking> = {
    'DM-2048': {
        orderId: 'DM-2048',
        productSummary: 'Fresh Tomatoes · 5 kg',
        origin: 'Nashik, Maharashtra',
        destination: 'Mumbai, Maharashtra',
        eta: 'Today, 6:00 PM',
        carrier: 'GreenRoute Logistics · MH 12 TR 4821',
        currentStatus: 'IN_TRANSIT',
        progress: 72,
        distanceKm: 165,
        distanceCoveredKm: 119,
        nextStop: 'Pune collection hub',
        lastUpdated: 'Updated 4 min ago',
        checkpoints: [{ label: 'Condition', value: 'Cool & protected' }, { label: 'Load', value: '5 kg produce' }, { label: 'Next scan', value: 'In 38 min' }],
        milestones: [
            { title: 'Order placed', detail: 'Your order was confirmed', time: '03 Sep · 09:40', status: 'PLACED' },
            { title: 'Farmer accepted', detail: 'Sunita Devi confirmed the harvest', time: '03 Sep · 10:15', status: 'ACCEPTED' },
            { title: 'Packed at source', detail: 'Quality checked and packed', time: '03 Sep · 14:20', status: 'PACKED' },
            { title: 'In transit', detail: 'Heading to the Mumbai delivery hub', time: 'Expected today', status: 'IN_TRANSIT' },
            { title: 'Delivered', detail: 'Delivery confirmation pending', time: 'Pending', status: 'DELIVERED' },
        ],
    },
    'DM-2016': {
        orderId: 'DM-2016',
        productSummary: 'Sona Masuri Rice · 10 kg',
        origin: 'Mandya, Karnataka',
        destination: 'Bengaluru, Karnataka',
        eta: 'Delivered yesterday',
        carrier: 'FarmLink Express · KA 01 AB 2190',
        currentStatus: 'DELIVERED',
        progress: 100,
        distanceKm: 118,
        distanceCoveredKm: 118,
        nextStop: 'Delivered to buyer',
        lastUpdated: 'Delivered 30 Aug',
        checkpoints: [{ label: 'Condition', value: 'Received fresh' }, { label: 'Load', value: '10 kg produce' }, { label: 'Proof', value: 'Confirmed' }],
        milestones: [
            { title: 'Order placed', detail: 'Your order was confirmed', time: '28 Aug · 11:10', status: 'PLACED' },
            { title: 'Farmer accepted', detail: 'Krishna FPO confirmed the order', time: '28 Aug · 11:42', status: 'ACCEPTED' },
            { title: 'Packed at source', detail: 'Quality checked and packed', time: '29 Aug · 08:30', status: 'PACKED' },
            { title: 'In transit', detail: 'Shipment reached Bengaluru', time: '29 Aug · 15:10', status: 'IN_TRANSIT' },
            { title: 'Delivered', detail: 'Received by Ananya Kapoor', time: '30 Aug · 10:05', status: 'DELIVERED' },
        ],
    },
}

export async function getOrderTracking(orderId: string): Promise<OrderTracking | null> {
    await new Promise((resolve) => window.setTimeout(resolve, 180))
    return trackingData[orderId] ?? null
}
