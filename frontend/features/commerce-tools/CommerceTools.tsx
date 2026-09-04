import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Check, GitCompare, MessageCircle, Star, X } from 'lucide-react'
import type { Product } from '../../mock/products'
import { products } from '../../mock/products'
import { PageLayout } from '../../layouts'
import { applyCoupon, getCompareIds, getCoupon, getRecentIds, recordRecent, toggleCompare } from './service'
import './commerce-tools.css'

export function CompareButton({ productId }: { productId: string }) {
  const [selected, setSelected] = useState(() => getCompareIds().includes(productId))
  return <button className={selected ? 'compare-button selected' : 'compare-button'} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setSelected(toggleCompare(productId)) }}><GitCompare size={13} /> {selected ? 'Compared' : 'Compare'}</button>
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const recent = getRecentIds().filter((id) => id !== excludeId).map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product))
  if (!recent.length) return null
  return <section className="recent-section"><div className="section-heading"><div><p className="eyebrow">CONTINUE EXPLORING</p><h2>Recently viewed</h2></div><Link className="text-button" to="/marketplace">View marketplace <ArrowRight size={14} /></Link></div><div className="recent-grid">{recent.map((product) => <Link className="recent-card" to={`/marketplace/${product.id}`} key={product.id}><img src={product.image} alt="" /><span><b>{product.name}</b><small>₹{product.price}/{product.unit} · {product.rating} <Star size={11} fill="currentColor" /></small></span></Link>)}</div></section>
}

export function ComparisonPage() {
  const [ids, setIds] = useState(getCompareIds())
  const selected = ids.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product))
  return <PageLayout className="comparison-page"><div className="section-heading"><div><p className="eyebrow">BUY WITH CONFIDENCE</p><h1>Compare your shortlist.</h1><p>See price, quality, availability and seller signals side by side.</p></div><Link className="secondary-button" to="/marketplace">Back to marketplace</Link></div>{selected.length < 2 ? <div className="comparison-empty"><GitCompare size={30} /><b>Select at least two products to compare.</b><span>Use Compare on any marketplace card. You can shortlist up to three.</span><Link className="primary-button" to="/marketplace">Browse products <ArrowRight size={15} /></Link></div> : <div className="comparison-table">{selected.map((product) => <article key={product.id}><button aria-label={`Remove ${product.name} from comparison`} onClick={() => { toggleCompare(product.id); setIds(getCompareIds()) }}><X size={14} /></button><img src={product.image} alt={product.name} /><h2>{product.name}</h2><strong>₹{product.price}/{product.unit}</strong><span><Star size={13} fill="currentColor" /> {product.rating} rating</span><span>{product.quality}</span><span>{product.quantity.toLocaleString()} {product.unit} available</span><small>{product.farmer}<br />{product.location}</small><Link className="primary-button" to={`/marketplace/${product.id}`}>View details</Link></article>)}</div>}</PageLayout>
}

export function ShoppingAssistant() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('Tell me what you need and I’ll suggest a good starting point.')
  const [input, setInput] = useState('')
  const suggestions = [{ label: 'Best deal today', answer: 'Potato Jyoti is ₹18/kg with 12,000 kg available.', href: '/marketplace/potato-01' }, { label: 'High demand crops', answer: 'Mangoes and tomatoes are trending this week.', href: '/features/demand' }, { label: 'Compare shortlist', answer: 'Open comparison to review up to three products.', href: '/compare' }]
  return <div className="assistant-widget"><button className="assistant-trigger" aria-label="Open AI chat assistant" onClick={() => setOpen((value) => !value)}>{open ? <X size={19} /> : <Bot size={19} />}</button>{open && <div className="assistant-panel"><div className="assistant-title"><div><b>AI market chat</b><small>Ask about products, prices or delivery</small></div><MessageCircle size={17} /></div><p>{message}</p><div className="assistant-suggestions">{suggestions.map((item) => <Link to={item.href} key={item.label} onClick={() => setMessage(item.answer)}>{item.label}<ArrowRight size={13} /></Link>)}</div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); if (input.trim()) { setMessage(`I can help with “${input.trim()}”. Try a marketplace search or one of the quick options above.`); setInput('') } }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your question..." aria-label="Type a chat message" /><button type="submit" aria-label="Send chat message"><ArrowRight size={14} /></button></form></div>}</div>
}

export function RecentlyViewedRecorder({ productId }: { productId: string }) {
  useEffect(() => { recordRecent(productId) }, [productId])
  return null
}

export function CouponField({ onApplied }: { onApplied?: (rate: number) => void } = {}) {
  const [code, setCode] = useState(getCoupon() ?? '')
  const [message, setMessage] = useState('')
  return <div className="coupon-field"><label>Offers & coupons<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Try FARM10" /></label><button onClick={() => { const valid = applyCoupon(code); setMessage(valid ? 'Coupon applied: 10% off' : 'Try FARM10 or FIRSTBUY'); onApplied?.(valid ? 0.1 : 0) }}>{getCoupon() ? <Check size={14} /> : 'Apply'}</button>{message && <small>{message}</small>}</div>
}

const reviewData = [
  { name: 'Anita Menon', rating: 5, text: 'Excellent freshness and careful packing. The origin details were exactly as shown.' },
  { name: 'Rahul Foods', rating: 4, text: 'Consistent quality and the delivery updates made bulk ordering easy.' },
  { name: 'Priya Shah', rating: 5, text: 'Good value from a verified farmer. I will order this harvest again.' },
]

export function ReviewPanel({ product }: { product: Product }) {
  return <section className="reviews-panel"><div className="section-heading"><div><p className="eyebrow">BUYER FEEDBACK</p><h2>Rated {product.rating} out of 5</h2></div><span className="review-count">36 verified reviews</span></div><div className="review-summary"><strong>{product.rating}</strong><div><span className="review-stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'} />)}</span><small>Trusted quality signal from recent buyers</small></div></div><div className="review-list">{reviewData.map((review) => <article key={review.name}><div><b>{review.name}</b><span>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} fill={star <= review.rating ? 'currentColor' : 'none'} />)}</span></div><p>{review.text}</p></article>)}</div></section>
}
