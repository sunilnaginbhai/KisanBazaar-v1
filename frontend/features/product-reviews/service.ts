import type { ProductReview } from './types'

const reviews: ProductReview[] = [
  { id: 'review-1', productId: 'tomato-01', reviewer: 'Anita Menon', rating: 5, title: 'Excellent freshness', comment: 'Careful packing and accurate origin details. The tomatoes arrived firm and fresh.', verified: true, date: '2 days ago' },
  { id: 'review-2', productId: 'rice-01', reviewer: 'Rahul Foods', rating: 4, title: 'Consistent quality', comment: 'Reliable quality for bulk ordering, with useful delivery updates throughout.', verified: true, date: '1 week ago' },
  { id: 'review-3', productId: 'mango-01', reviewer: 'Priya Shah', rating: 5, title: 'Would order again', comment: 'Great value from a verified farmer. The harvest was exactly as described.', verified: true, date: '2 weeks ago' },
]

const reviewStorageKey = 'direct-market-product-reviews'

function getSubmittedReviews() {
  try {
    return JSON.parse(localStorage.getItem(reviewStorageKey) ?? '[]') as ProductReview[]
  } catch {
    return []
  }
}

export function getProductReviews(productId: string) {
  return [...getSubmittedReviews(), ...reviews].filter((review) => review.productId === productId)
}

export function getFeaturedReviews() {
  return [...getSubmittedReviews(), ...reviews]
}

export function saveProductReview(review: Omit<ProductReview, 'id' | 'date' | 'verified'>) {
  const nextReview: ProductReview = {
    ...review,
    id: `review-${Date.now()}`,
    verified: false,
    date: 'Just now',
  }
  localStorage.setItem(reviewStorageKey, JSON.stringify([nextReview, ...getSubmittedReviews()]))
  return nextReview
}
