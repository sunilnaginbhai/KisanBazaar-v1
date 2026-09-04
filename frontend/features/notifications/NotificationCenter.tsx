import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, CheckCheck, ChevronRight, Package, Sparkles, TrendingDown, Users, X } from 'lucide-react'
import { authService } from '../../services/authService'
import { categoryLabel, getNotifications, saveNotifications } from './service'
import type { NotificationCategory, NotificationItem } from './types'
import './notifications.css'

const categoryIcons = { delivery: Package, inventory: Package, market: TrendingDown, account: Users }

export function NotificationCenter() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof authService.getCurrentUser>>>(null)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all')
  const [items, setItems] = useState<NotificationItem[]>([])

  useEffect(() => { void authService.getCurrentUser().then((current) => { setSession(current); setItems(getNotifications(current)) }) }, [])

  const visible = useMemo(() => filter === 'all' ? items : items.filter((item) => item.category === filter), [filter, items])
  const unread = items.filter((item) => !item.read).length
  const update = (next: NotificationItem[]) => { setItems(next); saveNotifications(next) }
  const markRead = (id: string) => update(items.map((item) => item.id === id ? { ...item, read: true } : item))
  const dismiss = (id: string) => update(items.filter((item) => item.id !== id))

  return <div className="notification-center">
    <button className="icon-button notification-trigger" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={19} />{unread > 0 && <em>{unread}</em>}</button>
    {open && <div className="notification-popover" role="dialog" aria-label="Notifications">
      <div className="notification-header"><div><p className="eyebrow">YOUR NETWORK</p><h2>Notifications</h2><span>{unread ? `${unread} unread updates` : 'You are all caught up'}</span></div><button className="notification-close" aria-label="Close notifications" onClick={() => setOpen(false)}><X size={17} /></button></div>
      <div className="notification-toolbar"><div className="notification-filters"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>{(['delivery', 'inventory', 'market', 'account'] as NotificationCategory[]).map((category) => <button className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{categoryLabel(category)}</button>)}</div>{unread > 0 && <button className="mark-all" onClick={() => update(items.map((item) => ({ ...item, read: true })))}><CheckCheck size={14} /> Mark all read</button>}</div>
      <div className="notification-list">{visible.length ? visible.map((item) => { const Icon = categoryIcons[item.category]; return <div className={item.read ? 'notification-item read' : 'notification-item'} key={item.id}><div className="notification-icon"><Icon size={16} /></div><div className="notification-copy"><div><b>{item.title}</b>{!item.read && <i />}</div><p>{item.message}</p><small>{item.time} · {categoryLabel(item.category)}</small><Link to={item.href} onClick={() => { markRead(item.id); setOpen(false) }}>View update <ChevronRight size={13} /></Link></div><button className="notification-dismiss" aria-label={`Dismiss ${item.title}`} onClick={() => dismiss(item.id)}><X size={14} /></button></div> }) : <div className="notification-empty"><Sparkles size={22} /><b>No updates in this view</b><span>Try another category or check back later.</span></div>}</div>
      <div className="notification-footer">{session ? <span><Check size={13} /> Updates are tailored to your role</span> : <Link to="/login" onClick={() => setOpen(false)}>Sign in for personalized alerts <ChevronRight size={13} /></Link>}</div>
    </div>}
  </div>
}
