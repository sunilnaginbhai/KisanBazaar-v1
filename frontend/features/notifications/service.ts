import { readStorage, writeStorage } from '../../utils/storage'
import type { Session } from '../../services/authService'
import type { NotificationItem, NotificationCategory } from './types'

const storageKey = 'direct-market-notifications'

const seedNotifications: NotificationItem[] = [
  { id: 'delivery-2048', role: 'bulk-buyer', category: 'delivery', title: 'Shipment arriving today', message: 'DM-2048 is 42 km from Mumbai and remains on schedule.', time: '12 min ago', href: '/orders/DM-2048', read: false },
  { id: 'market-tomato', role: 'all', category: 'market', title: 'Tomato prices moved', message: 'Nashik direct offers are 8% below this week’s regional average.', time: '1 hr ago', href: '/features/price', read: false },
  { id: 'inventory-onion', role: 'farmer', category: 'inventory', title: 'Low-stock alert', message: 'Red Onion has 18% available stock remaining. Review your listing.', time: '2 hrs ago', href: '/farmer/inventory', read: false },
  { id: 'demand-mango', role: 'farmer', category: 'market', title: 'Demand signal updated', message: 'Mango demand is forecast to rise 24% over the next seven days.', time: 'Yesterday', href: '/features/demand', read: true },
  { id: 'account-verified', role: 'all', category: 'account', title: 'Profile is verified', message: 'Your marketplace identity checks are complete.', time: 'Yesterday', href: '/impact', read: true },
  { id: 'admin-route', role: 'admin', category: 'delivery', title: 'Route review ready', message: 'Three active routes need an operations review before dispatch.', time: 'Yesterday', href: '/admin/logistics', read: false },
]

export function getNotifications(session: Session | null): NotificationItem[] {
  const saved = readStorage<NotificationItem[] | null>(storageKey, null)
  const source = saved ?? seedNotifications
  if (!saved) writeStorage(storageKey, source)
  return source.filter((item) => item.role === 'all' || item.role === session?.role)
}

export function saveNotifications(items: NotificationItem[]) {
  writeStorage(storageKey, items)
}

export function categoryLabel(category: NotificationCategory) {
  return category === 'delivery' ? 'Delivery' : category === 'inventory' ? 'Inventory' : category === 'market' ? 'Market' : 'Account'
}
