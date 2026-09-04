import { AlertTriangle, Boxes, PackagePlus, Search, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { inventoryStatuses } from './constants'
import { useFarmerInventory } from './hooks'
import './farmer-inventory.css'

export function FarmerInventory() {
    const { data, loading } = useFarmerInventory()
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<(typeof inventoryStatuses)[number]>('All stock')
    const filtered = useMemo(() => (data?.items ?? []).filter((item) => {
        const matchesSearch = `${item.product.name} ${item.product.category}`.toLowerCase().includes(search.toLowerCase())
        const low = item.product.quantity < item.threshold
        return matchesSearch && (status === 'All stock' || status === 'Low stock' && low || status === 'Healthy' && !low)
    }), [data, search, status])
    if (loading) return <section className="inventory-page"><div className="loading-state">Loading your stock workspace...</div></section>
    if (!data) return <section className="inventory-page"><div className="empty-state">Inventory is unavailable right now.</div></section>
    return <section className="inventory-page">
        <div className="inventory-header"><div><p className="eyebrow">FARMER WORKSPACE · INVENTORY</p><h1>Stock, in <i>balance.</i></h1><p>Know what is available, reserved, and ready for your next buyer.</p></div><Link to="/farmer/products/new" className="primary-button"><PackagePlus size={16} /> Add harvest</Link></div>
        <div className="inventory-stats"><div><span><Boxes size={17} /></span><b>{data.totalAvailable.toLocaleString()} kg</b><small>Available stock</small></div><div><span><Truck size={17} /></span><b>{data.totalReserved.toLocaleString()} kg</b><small>Reserved for orders</small></div><div className={data.lowStockCount ? 'warning' : ''}><span><AlertTriangle size={17} /></span><b>{data.lowStockCount}</b><small>Low-stock alerts</small></div></div>
        {data.lowStockCount > 0 && <div className="inventory-alert"><AlertTriangle size={17} /><span><b>Action needed: {data.lowStockCount} products are below their restock threshold.</b><small>Top up inventory before accepting new bulk orders.</small></span><button onClick={() => setStatus('Low stock')}>Review alerts</button></div>}
        <div className="inventory-toolbar"><label><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your products" /></label><div>{inventoryStatuses.map((item) => <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div></div>
        <div className="inventory-table"><div className="inventory-table-head"><span>Product</span><span>Available</span><span>Reserved</span><span>Stock health</span><span>Updated</span></div>{filtered.map((item) => { const low = item.product.quantity < item.threshold; const health = Math.min(100, Math.round(item.product.quantity / (item.threshold * 2) * 100)); return <div className="inventory-row" key={item.product.id}><div className="inventory-product"><img src={item.product.image} alt="" /><span><b>{item.product.name}</b><small>{item.product.category} · {item.product.unit}</small></span></div><strong>{item.product.quantity.toLocaleString()} {item.product.unit}</strong><span>{item.reserved.toLocaleString()} {item.product.unit}</span><div className="health-cell"><span className="health-track"><i className={low ? 'low' : ''} style={{ width: `${health}%` }} /></span><small>{low ? 'Restock soon' : 'Healthy'}</small></div><small>{item.updated}</small></div>})}</div>{!filtered.length && <div className="empty-state">No inventory matches your filters.</div>}
    </section>
}
