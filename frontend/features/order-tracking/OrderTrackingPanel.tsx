import { Bell, CheckCircle2, Clock3, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'
import { trackingStatusLabels } from './constants'
import { useOrderTracking } from './hooks'
import type { TrackingMilestone } from './types'
import './order-tracking.css'

function Milestone({ item, index, currentIndex }: { item: TrackingMilestone; index: number; currentIndex: number }) {
    const complete = index <= currentIndex
    return <div className={complete ? 'tracking-milestone complete' : 'tracking-milestone'}>
        <span>{complete ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</span>
        <div><b>{trackingStatusLabels[item.status]}</b><small>{item.detail}</small><small>{item.time}</small></div>
    </div>
}

export function OrderTrackingPanel({ orderId }: { orderId: string | undefined }) {
    const { tracking, loading } = useOrderTracking(orderId)
    const [alertsEnabled, setAlertsEnabled] = useState(false)
    if (loading) return <div className="tracking-empty">Loading shipment updates...</div>
    if (!tracking) return <div className="tracking-empty"><b>Tracking unavailable</b><span>We could not find shipment updates for this order.</span></div>

    return <div className="order-tracking-feature">
        <div className="tracking-summary">
            <div><p className="eyebrow">SHIPMENT OVERVIEW</p><h2>{tracking.productSummary}</h2><p>{tracking.carrier}</p></div>
            <div className="tracking-eta"><span>Estimated arrival</span><b>{tracking.eta}</b><small>{tracking.progress}% journey complete</small></div>
        </div>
        <div className="tracking-progress"><span style={{ width: `${tracking.progress}%` }} /></div>
        <div className="tracking-route-card"><span><MapPin size={18} />{tracking.origin}</span><i /><span><Truck size={18} />{tracking.destination}</span></div>
        <div className="tracking-live-row"><span className="live-indicator" /><b>Live route monitoring</b><small>{tracking.lastUpdated}</small><button className={alertsEnabled ? 'tracking-alert active' : 'tracking-alert'} onClick={() => setAlertsEnabled((enabled) => !enabled)}><Bell size={14} />{alertsEnabled ? 'Arrival alerts on' : 'Notify me on arrival'}</button></div>
        <div className="tracking-insight-grid">
            <div className="tracking-chart-card"><div className="tracking-card-heading"><span><b>Journey progress</b><small>{tracking.distanceCoveredKm} of {tracking.distanceKm} km covered</small></span><strong>{tracking.progress}%</strong></div><svg className="route-chart" viewBox="0 0 520 120" role="img" aria-label={`${tracking.progress}% of route completed`}><path d="M12 93 C 76 81, 97 38, 161 57 S 252 100, 314 54 S 408 22, 508 28" /><path className="route-chart-active" pathLength="100" style={{ strokeDasharray: `${tracking.progress} 100` }} d="M12 93 C 76 81, 97 38, 161 57 S 252 100, 314 54 S 408 22, 508 28" /><circle cx="12" cy="93" r="5" /><circle cx="508" cy="28" r="5" /></svg><div className="route-chart-labels"><span>{tracking.origin}</span><span>{tracking.nextStop}</span><span>{tracking.destination}</span></div></div>
            <div className="tracking-next-card"><p className="eyebrow">NEXT UP</p><h3>{tracking.currentStatus === 'DELIVERED' ? 'Delivery complete' : 'Arrival handoff'}</h3><p>{tracking.currentStatus === 'DELIVERED' ? 'Your order reached its destination safely.' : `The driver will scan the shipment at ${tracking.nextStop}.`}</p><span><ShieldCheck size={15} /> Temperature and quality checks active</span></div>
        </div>
        <div className="tracking-checkpoints">{tracking.checkpoints.map((checkpoint) => <div key={checkpoint.label}><small>{checkpoint.label}</small><b>{checkpoint.value}</b></div>)}</div>
        <div className="tracking-milestones">{tracking.milestones.map((item, index) => <Milestone key={item.status} item={item} index={index} currentIndex={tracking.milestones.findIndex((milestone) => milestone.status === tracking.currentStatus)} />)}</div>
        <div className="tracking-support"><span><b>Need help with this delivery?</b><small>Our logistics desk is available for shipment questions.</small></span><a href="tel:+911800123456"><Phone size={14} /> Contact support</a></div>
    </div>
}
