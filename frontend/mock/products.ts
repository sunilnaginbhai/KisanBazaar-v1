export type ProductCategory = 'Vegetables' | 'Grains' | 'Spices' | 'Fruits' | 'Cash crops'

export type Product = {
    id: string
    name: string
    category: ProductCategory
    farmer: string
    location: string
    price: number
    unit: string
    quantity: number
    quality: string
    organic: boolean
    rating: number
    image: string
    harvest: string
    accent: string
}

export const products: Product[] = [
    { id: 'tomato-01', name: 'Fresh Tomatoes', category: 'Vegetables', farmer: 'Kaveri FPO', location: 'Nashik, Maharashtra', price: 27, unit: 'kg', quantity: 2400, quality: 'Grade A', organic: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80', harvest: 'Today', accent: '#e46c48' },
    { id: 'onion-01', name: 'Red Onions', category: 'Vegetables', farmer: 'Ramesh Patil', location: 'Lasalgaon, Maharashtra', price: 31, unit: 'kg', quantity: 3800, quality: 'Grade A', organic: false, rating: 4.7, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80', harvest: 'Yesterday', accent: '#a85460' },
    { id: 'rice-01', name: 'Sona Masuri Rice', category: 'Grains', farmer: 'Krishna FPO', location: 'Mandya, Karnataka', price: 68, unit: 'kg', quantity: 1800, quality: 'Premium', organic: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80', harvest: '12 Aug 2026', accent: '#d8b779' },
    { id: 'mango-01', name: 'Alphonso Mangoes', category: 'Fruits', farmer: 'Sahyadri Growers', location: 'Ratnagiri, Maharashtra', price: 145, unit: 'kg', quantity: 620, quality: 'Export select', organic: false, rating: 4.9, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80', harvest: 'Today', accent: '#e7a840' },
    { id: 'wheat-01', name: 'Sharbati Wheat', category: 'Grains', farmer: 'Malwa Collective', location: 'Indore, Madhya Pradesh', price: 42, unit: 'kg', quantity: 5600, quality: 'Grade A', organic: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', harvest: '05 Aug 2026', accent: '#c89a52' },
    { id: 'groundnut-01', name: 'Bold Groundnuts', category: 'Cash crops', farmer: 'Sowmya Reddy', location: 'Anantapur, Andhra Pradesh', price: 86, unit: 'kg', quantity: 920, quality: 'Premium', organic: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=900&q=80', harvest: '08 Aug 2026', accent: '#ac784a' },
    { id: 'cumin-01', name: 'Cumin Seeds', category: 'Spices', farmer: 'Meena Kumari', location: 'Unjha, Gujarat', price: 320, unit: 'kg', quantity: 3200, quality: 'Grade A', organic: false, rating: 4.9, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80', harvest: '10 Aug 2026', accent: '#b98a45' },
    { id: 'turmeric-01', name: 'Organic Turmeric', category: 'Spices', farmer: 'Karnataka Farmers Collective', location: 'Hassan, Karnataka', price: 145, unit: 'kg', quantity: 6800, quality: 'Grade A', organic: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=80', harvest: '06 Aug 2026', accent: '#e4ac36' },
    { id: 'potato-01', name: 'Potato Jyoti', category: 'Vegetables', farmer: 'Rajesh Patel', location: 'Anand, Gujarat', price: 18, unit: 'kg', quantity: 12000, quality: 'Grade B', organic: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80', harvest: 'Yesterday', accent: '#bd8b61' },
    { id: 'banana-01', name: 'Banana Robusta', category: 'Fruits', farmer: 'Suresh Naidu', location: 'Coimbatore, Tamil Nadu', price: 35, unit: 'dozen', quantity: 4200, quality: 'Grade A', organic: false, rating: 4.4, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80', harvest: 'Today', accent: '#e8c44b' },
]
