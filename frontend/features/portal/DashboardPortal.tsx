import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, BarChart3, Download, Filter, MessageCircle, Package, Plus, Send, Sparkles, Truck, Users, WalletCards, ShieldCheck, Star, Leaf, ShoppingBag } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type PortalRole = 'Farmer' | 'Buyer' | 'Admin'

type DashboardPortalProps = {
  role: PortalRole
}

const activity = [
  { label: 'Tomatoes · Nashik cluster', orders: 42, value: 126000 },
  { label: 'Sona Masuri · Mandya FPO', orders: 28, value: 98000 },
  { label: 'Alphonso mangoes · Ratnagiri', orders: 19, value: 76000 },
  { label: 'Red onions · Lasalgaon', orders: 16, value: 44000 },
]

const trend = [
  { day: '04 Aug', orders: 28, value: 42 },
  { day: '08 Aug', orders: 35, value: 51 },
  { day: '12 Aug', orders: 31, value: 48 },
  { day: '16 Aug', orders: 45, value: 66 },
  { day: '20 Aug', orders: 40, value: 61 },
  { day: '24 Aug', orders: 55, value: 82 },
  { day: '28 Aug', orders: 63, value: 94 },
]
const categoryData = [{ name: 'Vegetables', value: 42 }, { name: 'Grains', value: 28 }, { name: 'Fruits', value: 18 }, { name: 'Spices', value: 12 }]
const recommendations = [
  { name: 'Fresh Tomatoes', farmer: 'Sunita Devi · Nashik', price: '₹28', unit: '/ kg', rating: '4.8', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80' },
  { name: 'Organic Turmeric', farmer: 'Erode FPO', price: '₹118', unit: '/ kg', rating: '4.7', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=500&q=80' },
  { name: 'Premium Wheat', farmer: 'Karnal Growers', price: '₹44', unit: '/ kg', rating: '4.9', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80' },
]

const roleCopy: Record<PortalRole, { eyebrow: string; title: string; action: string }> = {
  Farmer: { eyebrow: 'FARMER WORKSPACE · DEMO DATA', title: 'Your farm, in focus.', action: 'Add product' },
  Buyer: { eyebrow: 'BUYER WORKSPACE · DEMO DATA', title: 'Buying, made clear.', action: 'Browse marketplace' },
  Admin: { eyebrow: 'ADMIN CONTROL CENTRE · DEMO DATA', title: 'Platform, at a glance.', action: 'Export report' },
}

const chatCopy: Record<PortalRole, { title: string; intro: string; prompt: string; reply: string }> = {
  Farmer: { title: 'Farm assistant', intro: 'Ask about pricing, harvest planning or buyer demand.', prompt: 'What should I plant next?', reply: 'Tomato demand is trending 18% higher this week. Consider adding 600 kg to your next listing.' },
  Buyer: { title: 'Buying assistant', intro: 'Get quick help finding supply and comparing delivery options.', prompt: 'Find the best value nearby', reply: 'I found three verified suppliers. Nashik tomatoes offer the best landed price for your next order.' },
  Admin: { title: 'Operations assistant', intro: 'Ask about platform health, fulfilment or route exceptions.', prompt: 'Show today’s risk signals', reply: 'Two routes need attention. Vehicle GJ-TRK-04 is at 91% capacity and one listing is awaiting review.' },
}

export function DashboardPortal({ role }: DashboardPortalProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [range, setRange] = useState('Last 30 days')
  const [chatMessage, setChatMessage] = useState('')
  const [chatReply, setChatReply] = useState('')
  const copy = roleCopy[role]
  const isAdmin = role === 'Admin'
  const metrics = useMemo(() => isAdmin
    ? [['2,400', 'Total Farmers', Users], ['8,420', 'Active Products', Package], ['12,840', 'Total Orders', ShoppingBag], ['₹1.8 Cr', 'Platform Revenue', WalletCards]]
    : role === 'Farmer'
      ? [['₹1.8L', 'Total Earnings', WalletCards], ['12', 'Active Products', Package], ['342', 'Total Orders', ShoppingBag], ['4.8', 'Average Rating', Star]]
      : [['24', 'Total Orders', ShoppingIcon], ['₹18,420', 'Total Spending', WalletCards], ['03', 'Active Deliveries', Truck], ['12', 'Saved Products', Package]], [isAdmin, role])

  const section = location.pathname.split('/').pop() || 'dashboard'
  const sectionMeta: Record<string, { title: string; subtitle: string; chart: string; panel: string }> = {
    analytics: { title: 'Analytics, with context.', subtitle: 'Track demand, revenue and supply performance across every region.', chart: 'Revenue and demand trend', panel: 'Regional performance' },
    logistics: { title: 'Logistics, in motion.', subtitle: 'Monitor routes, capacity and delivery performance in one view.', chart: 'Shipment performance', panel: 'Active route monitor' },
    orders: { title: 'Orders, under control.', subtitle: 'Review status, value and fulfilment progress without losing the detail.', chart: 'Order volume and value', panel: 'Latest order queue' },
    products: { title: 'Catalog, performing.', subtitle: 'Manage listings, inventory health and product-level demand signals.', chart: 'Product demand trend', panel: 'Top performing products' },
    inventory: { title: 'Inventory, in balance.', subtitle: 'Keep stock healthy with low-stock alerts and reserved quantity visibility.', chart: 'Inventory movement', panel: 'Stock health' },
    users: { title: 'People, connected.', subtitle: 'Understand who is active across farmers, FPOs and buyers.', chart: 'User growth', panel: 'Recent registrations' },
  }
  const meta = sectionMeta[section]
  const title = meta?.title ?? copy.title

  return (
    <section className="portal-content portal-dashboard">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{title}</h1>
          <p className="portal-subtitle">{meta?.subtitle ?? 'A live view of your demo marketplace activity and next best actions.'}</p>
        </div>
        <button className="primary-button" onClick={() => role === 'Farmer' ? navigate('/farmer/products/new') : role === 'Buyer' ? navigate('/marketplace') : undefined}>
          {isAdmin && <Download size={15} />}{copy.action}{!isAdmin && <ArrowUpRight size={15} />}
        </button>
      </div>

      <div className="metric-grid">
        {metrics.map(([value, label, Icon]) => {
          const MetricIcon = Icon as typeof Package
          return <div className="metric-card" key={label as string}><span className="metric-icon"><MetricIcon size={18} /></span><strong>{value as string}</strong><small>{label as string}</small><em className="metric-change">+12.4% <ArrowUpRight size={11} /></em></div>
        })}
      </div>

      {isAdmin && <div className="dashboard-secondary-metrics">{[['2,280', 'Verified Farmers', ShieldCheck], ['1,460', 'Organic Products', Leaf], ['186', 'FPOs Registered', Users], ['4.8 / 5', 'Average Rating', Star]].map(([value, label, Icon]) => <div className="secondary-metric" key={label as string}><Icon size={16} /><span><strong>{value as string}</strong><small>{label as string}</small></span></div>)}</div>}

      {role === 'Buyer' && <section className="dashboard-role-section buyer-dashboard-section"><div className="panel-title"><div><p className="eyebrow">PERSONALIZED FOR YOU</p><h2>Recommended Products</h2></div><Link className="text-button" to="/marketplace">Shop all <ArrowUpRight size={14} /></Link></div><div className="recommendation-grid">{recommendations.map((item) => <Link className="recommendation-card" to="/marketplace" key={item.name}><img src={item.image} alt="" /><div><b>{item.name}</b><small>{item.farmer}</small><strong>{item.price}<em>{item.unit}</em></strong><span><Star size={12} fill="currentColor" /> {item.rating}</span></div></Link>)}</div></section>}

      {role === 'Farmer' && <section className="dashboard-role-section farmer-dashboard-section"><div className="panel-title"><div><p className="eyebrow">FARM INVENTORY</p><h2>My Products</h2></div><Link className="text-button" to="/farmer/products">Manage products <ArrowUpRight size={14} /></Link></div><div className="farmer-products-list">{[['Fresh Tomatoes', '₹28 / kg', '2,400 kg', 'Grade A', '4.8'], ['Red Onions', '₹34 / kg', '8,500 kg', 'Grade A', '4.7'], ['Sona Masuri Rice', '₹62 / kg', '1,800 kg', 'Grade A+', '4.9']].map(([name, price, quantity, grade, rating]) => <div className="farmer-product-row" key={name}><span className="product-thumb"><Package size={18} /></span><span><b>{name}</b><small>{price} · {quantity}</small></span><span><small>Quality</small><b>{grade}</b></span><span><Star size={12} fill="currentColor" /> {rating}</span></div>)}</div><div className="demand-insight-inline"><Sparkles size={18} /><span><b>AI Demand Insights <em>Prototype / Demo</em></b><small>Tomato demand is expected to rise 18% over the next 7 days. Recommended supply: 600 kg · Confidence 82%.</small></span></div></section>}

      <div className="dashboard-toolbar">
        <div><span className="live-indicator" /> <b>Live demo network</b><small> Synced just now</small></div>
        <div className="toolbar-actions"><button className="filter-button"><Filter size={14} /> Filters</button><select value={range} onChange={(event) => setRange(event.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select></div>
      </div>

      <div className="portal-columns">
        <div className="data-panel chart-panel">
          <div className="panel-title"><div><h2>{meta?.chart ?? (isAdmin ? 'Marketplace activity' : role === 'Farmer' ? 'Revenue performance' : 'Spending overview')}</h2><span>₹ value · {range.toLowerCase()}</span></div><BarChart3 size={18} color="#7a9b49" /></div>
          <div className="line-chart"><ResponsiveContainer width="100%" height={235}><AreaChart data={trend.map((point) => ({ ...point, value: role === 'Farmer' ? point.value + 18 : role === 'Buyer' ? Math.max(24, point.value - 10) : point.value }))}><defs><linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8cb62" stopOpacity={0.35} /><stop offset="100%" stopColor="#b8cb62" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8ede5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a857e' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a857e' }} /><Tooltip contentStyle={{ border: '1px solid #dfe4db', borderRadius: 6, fontSize: 11 }} formatter={(value) => [`₹${String(value)}k`, 'Value']} /><Area type="monotone" dataKey="value" stroke="#6f9145" strokeWidth={2.5} fill="url(#valueFill)" activeDot={{ r: 5, fill: '#ef8b52', stroke: '#fff', strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div>
        </div>

      <div className="data-panel insight-panel"><div className="panel-title"><h2><Sparkles size={16} /> {section === 'logistics' ? 'Route efficiency' : section === 'orders' ? 'Fulfilment signal' : section === 'products' ? 'Product opportunity' : 'AI demand signal'}</h2><span className="prototype-label">Prototype</span></div><div className="insight-highlight"><strong>{section === 'logistics' ? 'Nashik → Mumbai is on time' : section === 'orders' ? '92% orders on schedule' : section === 'products' ? 'Mango demand is rising' : 'Tomato demand is HIGH'}</strong><span>{section === 'logistics' ? 'Vehicle utilization · 78%' : section === 'orders' ? 'Average fulfilment · 1.8 days' : section === 'products' ? '+24% expected over the next 7 days' : 'Expected +18% over the next 7 days'}</span></div><div className="insight-stats"><span><b>{section === 'logistics' ? '184 km' : section === 'orders' ? '142' : '2,400 kg'}</b><small>{section === 'logistics' ? 'route distance' : section === 'orders' ? 'open orders' : 'recommended supply'}</small></span><span><b>{section === 'logistics' ? '4h 20m' : section === 'orders' ? '₹18.4L' : '82%'}</b><small>{section === 'logistics' ? 'estimated time' : section === 'orders' ? 'order value' : 'confidence score'}</small></span></div><Link className="text-button" to={role === 'Farmer' ? '/farmer/ai' : '/marketplace'}>View details <ArrowUpRight size={15} /></Link></div>
      </div>

      <div className="role-chat-panel">
      <div className="role-chat-heading"><span className="metric-icon"><MessageCircle size={18} /></span><div><h2>{chatCopy[role].title}</h2><p>{chatCopy[role].intro}</p></div><span className="prototype-label">Role AI</span></div>
      <div className="role-chat-suggestions"><button type="button" onClick={() => { setChatMessage(chatCopy[role].prompt); setChatReply(chatCopy[role].reply) }}>{chatCopy[role].prompt}</button><button type="button" onClick={() => setChatReply(chatCopy[role].reply)}>Give me an update</button></div>
      {chatReply && <div className="role-chat-reply"><MessageCircle size={15} /><span>{chatReply}</span></div>}
      <form className="role-chat-form" onSubmit={(event) => { event.preventDefault(); if (chatMessage.trim()) { setChatReply(chatCopy[role].reply); setChatMessage('') } }}><input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder={`Message your ${role.toLowerCase()} assistant`} /><button className="primary-button" type="submit" aria-label="Send message"><Send size={15} /></button></form>
      </div>

      {isAdmin && <div className="admin-analytics-row"><div className="data-panel"><div className="panel-title"><h2>Product Categories</h2><span className="prototype-label">Demo Data</span></div><div className="category-chart"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={categoryData} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3}>{categoryData.map((entry, index) => <Cell key={entry.name} fill={['#2d6a4f', '#78a85b', '#e89b58', '#b8c96b'][index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="category-legend">{categoryData.map((entry, index) => <span key={entry.name}><i style={{ background: ['#2d6a4f', '#78a85b', '#e89b58', '#b8c96b'][index] }} />{entry.name} <b>{entry.value}%</b></span>)}</div></div></div><div className="data-panel"><div className="panel-title"><h2>User Growth</h2><span className="prototype-label">Demo Data</span></div><ResponsiveContainer width="100%" height={225}><BarChart data={trend}><CartesianGrid vertical={false} stroke="#e8ede5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} /><Tooltip /><Bar dataKey="orders" fill="#2d6a4f" radius={[4, 4, 0, 0]} name="New users" /></BarChart></ResponsiveContainer></div></div>}
      <div className="data-panel table-panel"><div className="panel-title"><div><h2>{isAdmin ? 'Recent Orders' : meta?.panel ?? 'Recent Orders'}</h2><span>{activity.length} tracked categories</span></div><Link to={isAdmin ? '/admin/orders' : role === 'Farmer' ? '/farmer/orders' : '/buyer/orders'} className="text-button">View all <ArrowUpRight size={14} /></Link></div><div className="activity-table">{activity.map((item, index) => <div className="activity-row" key={item.label}><span className={`activity-rank rank-${index + 1}`}>0{index + 1}</span><div><b>{isAdmin ? `#DM-${2048 - index * 16}` : item.label}</b><small>{section === 'logistics' ? `${item.orders + 12} shipments · live route` : section === 'orders' ? `${item.orders} orders · fulfilment queue` : `${item.orders} orders · ${index % 2 ? 'In transit' : 'Delivered'}`}</small></div><strong>₹{(item.value / 1000).toFixed(0)}k</strong><span className="activity-bar"><i style={{ width: `${Math.max(28, item.orders * 1.5)}%` }} /></span></div>)}</div></div>
      {isAdmin && <div className="admin-shortcuts"><Link to="/admin/users"><Users size={17} /><span><b>User directory</b><small>Farmers, FPOs and buyers</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/logistics"><Truck size={17} /><span><b>Shipment control</b><small>08 routes currently moving</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/products"><Plus size={17} /><span><b>Catalog operations</b><small>Review and approve listings</small></span><ArrowUpRight size={15} /></Link></div>}
    </section>
  )
}

function ShoppingIcon() {
  return <Package size={18} />
}
