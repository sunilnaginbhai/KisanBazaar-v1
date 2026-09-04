import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MessageSquare, Star } from 'lucide-react'
import type { Product } from '../../mock/products'
import { getFeaturedReviews, getProductReviews, saveProductReview } from './service'
import './product-reviews.css'

function Stars({ rating }: { rating: number }) {
  return <span className="product-review-stars" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill={star <= rating ? 'currentColor' : 'none'} />)}</span>
}

function WriteReviewForm({ product, onSubmitted }: { product: Product; onSubmitted: (review: ReturnType<typeof saveProductReview>) => void }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const submit = () => {
    if (name.trim().length < 2 || title.trim().length < 3 || comment.trim().length < 10) {
      setError('Add your name, a short title, and at least 10 characters of feedback.')
      return
    }
    onSubmitted(saveProductReview({ productId: product.id, reviewer: name.trim(), rating, title: title.trim(), comment: comment.trim() }))
    setName('')
    setTitle('')
    setComment('')
    setError('')
  }
  return <div className="write-review"><div><h3>Share your experience</h3><p>Your feedback helps other buyers choose with confidence.</p></div><div className="review-rating-picker" aria-label="Choose a rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} aria-label={`${value} stars`} className={value <= rating ? 'active' : ''} onClick={() => setRating(value)}><Star size={18} fill="currentColor" /></button>)}</div><div className="review-form-grid"><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Asha Rao" /></label><label>Review title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What stood out?" /></label></div><label className="review-comment">Your review<textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder={`How was your ${product.name.toLowerCase()}?`} /></label>{error && <p className="error-message">{error}</p>}<button type="button" className="primary-button review-submit" onClick={submit}>Publish review <ArrowRight size={15} /></button></div>
}

export function ProductReviewPanel({ product }: { product: Product }) {
  const [submitted, setSubmitted] = useState<ReturnType<typeof saveProductReview> | null>(null)
  const reviews = [...(submitted ? [submitted] : []), ...getProductReviews(product.id).filter((review) => review.id !== submitted?.id)]
  const visible = reviews.length ? reviews : getFeaturedReviews()
  const [filter, setFilter] = useState<'all' | 'verified'>('all')
  const filtered = useMemo(() => filter === 'verified' ? visible.filter((review) => review.verified) : visible, [filter, visible])
  return <section className="product-reviews"><div className="product-reviews-heading"><div><p className="eyebrow">BUYER FEEDBACK</p><h2>What buyers are saying</h2><p>Verified feedback helps you choose confidently.</p></div><Link className="text-button" to="/reviews">See all reviews <ArrowRight size={14} /></Link></div><div className="product-review-summary"><strong>{product.rating}</strong><div><Stars rating={Math.round(product.rating)} /><small>Average rating from recent marketplace orders</small></div><div className="review-bars">{[5, 4, 3].map((rating, index) => <span key={rating}><b>{rating}</b><i><em style={{ width: `${[82, 14, 4][index]}%` }} /></i></span>)}</div></div><div className="review-controls"><span>{filtered.length} featured reviews</span><button className={filter === 'verified' ? 'active' : ''} onClick={() => setFilter(filter === 'verified' ? 'all' : 'verified')}><CheckCircle2 size={14} /> Verified only</button></div><div className="product-review-list">{filtered.map((review) => <article key={review.id}><div className="review-card-top"><div><b>{review.reviewer}</b><span>{review.verified && <><CheckCircle2 size={12} /> Verified purchase</>} · {review.date}</span></div><Stars rating={review.rating} /></div><h3>{review.title}</h3><p>{review.comment}</p></article>)}</div><WriteReviewForm product={product} onSubmitted={setSubmitted} /></section>
}

export function ReviewsPage() {
  const reviews = getFeaturedReviews()
  return <section className="reviews-page"><div className="reviews-page-hero"><p className="eyebrow">TRUSTED BY BUYERS</p><h1>Real harvests.<br /><i>Real feedback.</i></h1><p>Explore verified experiences from buyers across the Direct Market network.</p></div><div className="reviews-page-grid">{reviews.map((review) => <article key={review.id}><MessageSquare size={18} /><Stars rating={review.rating} /><h2>{review.title}</h2><p>{review.comment}</p><footer><b>{review.reviewer}</b><span>{review.verified ? 'Verified purchase' : 'Buyer'}</span></footer></article>)}</div><Link className="primary-button" to="/marketplace">Shop verified produce <ArrowRight size={16} /></Link></section>
}
