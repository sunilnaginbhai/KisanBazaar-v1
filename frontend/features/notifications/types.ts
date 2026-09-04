import type { UserRole } from '../../types/api'

export type NotificationCategory = 'delivery' | 'inventory' | 'market' | 'account'

export type NotificationItem = {
  id: string
  role: UserRole | 'all'
  category: NotificationCategory
  title: string
  message: string
  time: string
  href: string
  read: boolean
}
