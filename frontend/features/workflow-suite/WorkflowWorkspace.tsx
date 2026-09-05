import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, Download, Filter, Grid2X2, List, Map, Package, Plus, Search, ShieldCheck, Truck, Users, WalletCards, X } from 'lucide-react'
import './workflow-suite.css'

type WorkspaceRole = 'farmer' | 'buyer' | 'admin'

const records = {
  farmer: {
    products: [['Fresh Tomatoes', '2,400 kg', 'Active'], ['Red Onion', '8,500 kg', 'Active'], ['Sona Masuri Rice', '1,800 kg', 'Draft']],
    orders: [['#DM-2048', 'Mumbai Fresh Foods', '₹42,600', 'Processing'], ['#DM-2016', 'Green Basket Co.', '₹28,400', 'Ready to ship'], ['#DM-1982', 'Harvest House', '₹19,800', 'Delivered']],
    earnings: [['Aug 28', 'Order payout', '₹42,600', 'Settled'], ['Aug 20', 'Order payout', '₹28,400', 'Settled'], ['Aug 12', 'Bonus incentive', '₹4,800', 'Settled']],
    ai: [['Tomatoes', '+18%', 'High demand', 'Add 600 kg this week'], ['Mangoes', '+24%', 'Rising demand', 'Reserve early harvest'], ['Onions', '-6%', 'Stable demand', 'Hold current price']],
  },
  buyer: {
    orders: [['#DM-2048', 'Fresh Tomatoes · 240 kg', '₹42,600', 'In transit'], ['#DM-2016', 'Sona Masuri · 180 kg', '₹28,400', 'Delivered'], ['#DM-1982', 'Red Onion · 500 kg', '₹19,800', 'Quoted']],
    recommendations: [['Alphonso Mangoes', 'Ratnagiri', '₹145/kg', 'Top match'], ['Organic Turmeric', 'Erode', '₹118/kg', 'Price drop'], ['Premium Wheat', 'Karnal', '₹44/kg', 'Fast delivery']],
  },
  admin: {
    users: [['Sunita Devi', 'Farmer', 'Nashik, MH', 'Verified'], ['Green Basket Co.', 'Bulk buyer', 'Mumbai, MH', 'Active'], ['Krishna FPO', 'Farmer', 'Mandya, KA', 'Review']],
    products: [['Fresh Tomatoes', 'Sunita Devi', '2,400 kg', 'Approved'], ['Organic Turmeric', 'Erode FPO', '780 kg', 'Review'], ['Premium Wheat', 'Karnal Growers', '4,200 kg', 'Approved']],
    orders: [['#DM-2048', 'Mumbai Fresh Foods', 'Nashik → Mumbai', 'On schedule'], ['#DM-2016', 'Green Basket Co.', 'Mandya → Bengaluru', 'Delivered'], ['#DM-1982', 'Harvest House', 'Ratnagiri → Pune', 'Needs review']],
    logistics: [['MH-TRK-08', 'Nashik → Mumbai', '184 km', '78% capacity'], ['KA-VAN-12', 'Mandya → Bengaluru', '142 km', '62% capacity'], ['GJ-TRK-04', 'Anand → Surat', '96 km', '91% capacity']],
    analytics: [['Transaction value', '₹18.4L', '+12.4%'], ['On-time delivery', '92%', '+4.2%'], ['Active growers', '2,400', '+8.6%']],
  },
} as const

const titles: Record<string, [string, string]> = {
  products: ['Catalog workspace', 'Create, review and maintain marketplace listings.'],
  orders: ['Orders workspace', 'Keep every order moving with clear status and ownership.'],
  earnings: ['Earnings workspace', 'Review settled payouts and revenue performance.'],
  ai: ['AI demand workspace', 'Use market signals to plan your next harvest.'],
  recommendations: ['Recommendations workspace', 'Shortlist supply that fits your buying pattern.'],
  users: ['User directory', 'Review farmer, FPO and buyer access across the platform.'],
  logistics: ['Fleet operations', 'Monitor routes, capacity and exceptions in one place.'],
  analytics: ['Platform analytics', 'Measure growth, service quality and marketplace health.'],
}

export function WorkflowWorkspace({ role }: { role: WorkspaceRole }) {
  const section = useLocation().pathname.split('/').pop() ?? 'dashboard'
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(section === 'new')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [selected, setSelected] = useState<readonly string[] | null>(null)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSelected(null)
      setNotice('')
    })
    return () => window.cancelAnimationFrame(frame)
  }, [section])
  const key = section === 'new' ? 'products' : section
  const title = titles[key] ?? ['Workspace overview', 'A focused view of your marketplace work.']
  const filtered = useMemo(() => {
    const data = (records[role] as Record<string, readonly (readonly string[])[]>)[key] ?? []
    return data.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()) && (status === 'All' || row.some((value) => value === status)))
  }, [key, query, role, status])
  const columns = role === 'admin' && key === 'analytics' ? ['Metric', 'Value', 'Change'] : role === 'buyer' && key === 'recommendations' ? ['Product', 'Region', 'Price', 'Signal'] : role === 'farmer' && key === 'ai' ? ['Crop', 'Trend', 'Signal', 'Recommendation'] : ['Item', 'Owner / route', 'Value / stock', 'Status']
  const isAdmin = role === 'admin'
  const adminStats = key === 'users' ? [['2,400', 'Total users', Users], ['1,186', 'Active buyers', Users], ['94%', 'Verified', CheckCircle2], ['+8.6%', 'Growth', BarChart3]] : key === 'products' ? [['8,420', 'Live SKUs', Package], ['96%', 'In stock', CheckCircle2], ['18', 'Low stock', Truck], ['₹18.4L', 'Catalog value', WalletCards]] : key === 'orders' ? [['1,248', 'Orders today', ClipboardList], ['₹6.8L', 'GMV today', WalletCards], ['92%', 'On time', CheckCircle2], ['38', 'Exceptions', Truck]] : key === 'logistics' ? [['42', 'Active vehicles', Truck], ['184', 'Shipments', Package], ['92%', 'On time', CheckCircle2], ['18 min', 'Avg delay', Map]] : [['₹18.4L', 'Revenue', WalletCards], ['24.8k', 'MAU', Users], ['4.8%', 'Conversion', BarChart3], ['₹1,284', 'AOV', WalletCards]]
  return <section className={`workflow-page ${isAdmin ? `admin-workspace admin-${key}` : ''}`}><div className="workflow-header"><div><p className="eyebrow"><span /> {role.toUpperCase()} WORKSPACE</p><h1>{showForm ? 'Add a new listing.' : title[0]}</h1><p>{showForm ? 'Publish a harvest with clear pricing and availability.' : title[1]}</p></div><div className="workflow-actions">{(role === 'farmer' && key === 'products') && <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={15} /> Add listing</button>}{isAdmin && <button className="secondary-button" onClick={() => setNotice('Report prepared for download.')}><Download size={14} /> Export</button>}</div></div>
    {isAdmin && !showForm && <div className="admin-stat-grid">{adminStats.map(([value, label, Icon]) => <div className="admin-stat-card" key={label as string}><span><Icon size={17} /></span><strong>{value as string}</strong><small>{label as string}</small></div>)}</div>}
    {showForm ? <ListingForm onDone={() => { setShowForm(false); setNotice('Listing saved as a draft.'); }} /> : <><div className="workflow-toolbar"><div className="workflow-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isAdmin ? `Search ${key}` : 'Search this workspace'} /></div><div className="workflow-filters"><Filter size={14} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Admin</option><option>Merchant</option><option>Customer</option><option>Active</option><option>Approved</option><option>Review</option><option>Delivered</option><option>On schedule</option><option>High demand</option></select></div>{isAdmin && key === 'products' && <div className="view-toggle"><button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} aria-label="Table view"><List size={15} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 size={15} /></button></div>}</div><div className="workflow-summary"><span><strong>{filtered.length}</strong> visible records</span><span><CheckCircle2 size={14} /> Live data · Synced just now</span></div><div className={`workflow-table ${view === 'grid' ? 'workflow-grid-view' : ''}`}>{filtered.length ? <><div className="workflow-row workflow-row-head">{columns.map((column) => <b key={column}>{column}</b>)}<span>Action</span></div>{filtered.map((row, index) => <div className="workflow-row" key={`${row[0]}-${index}`}>{row.map((value) => <span key={value} className={value.toLowerCase().includes('review') || value.toLowerCase().includes('exception') ? 'status-warning' : 'status-positive'}>{value}</span>)}<button className="row-action" onClick={() => { setSelected(row); setNotice(`${row[0]} is now selected.`) }}>Review <ArrowRight size={13} /></button></div>)}</> : <div className="workflow-empty"><ShieldCheck size={24} /><b>No records match your filters.</b><span>Try clearing the search or selecting All.</span></div>}</div>{notice && <div className="workflow-notice"><CheckCircle2 size={15} /> {notice}<button aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={14} /></button></div>}{selected && <aside className="workflow-drawer"><button aria-label="Close detail panel" onClick={() => setSelected(null)}><X size={16} /></button><p className="eyebrow">DETAIL VIEW</p><h2>{selected[0]}</h2><span className="drawer-status">Live · {selected[selected.length - 1]}</span><div className="drawer-details">{selected.slice(1).map((value, index) => <p key={`${value}-${index}`}><small>{columns[index + 1] ?? 'Detail'}</small><b>{value}</b></p>)}</div><div className="drawer-timeline"><b>Activity timeline</b><span><i />Record created</span><span><i />Latest status synced</span><span><i />Ready for review</span></div></aside>}</>}</section>
}

function ListingForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  return <div className="listing-form"><div className="form-heading"><div><p className="eyebrow">NEW MARKETPLACE LISTING</p><h2>Tell buyers about this harvest.</h2></div><Truck size={24} /></div><div className="form-grid"><label>Product name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Fresh tomatoes" /></label><label>Price per unit<input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="₹ 28 / kg" /></label><label>Available quantity<input placeholder="e.g. 2,400 kg" /></label><label>Harvest date<input type="date" /></label><label className="form-wide">Description<textarea placeholder="Quality, growing practice and delivery notes" /></label></div><div className="form-footer"><span><WalletCards size={15} /> Buyers see your transparent price breakdown</span><button className="primary-button" onClick={onDone} disabled={!name.trim() || !price.trim()}>Save draft <ArrowRight size={15} /></button></div></div>
}
