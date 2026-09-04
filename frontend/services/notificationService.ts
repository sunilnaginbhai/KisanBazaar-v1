import { readStorage, writeStorage } from '../utils/storage'
type Notification = { id: string; title: string; read: boolean }
const key = 'direct-market-notifications'
export const notificationService = { async getNotifications() { return { success: true, data: readStorage<Notification[]>(key, [{ id: 'n-1', title: 'New order received', read: false }]), message: 'Notifications loaded' } }, async markAsRead(id: string) { const items = readStorage<Notification[]>(key, []); writeStorage(key, items.map((item) => item.id === id ? { ...item, read: true } : item)); return { success: true, data: null, message: 'Notification updated' } } }
