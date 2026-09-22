import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Boxes, Package, Sparkles } from 'lucide-react'
import { DashboardPortal } from '../../portal/DashboardPortal'
import { aiService } from '../../../services/aiService'
import { products } from '../../../mock/products'
import { readStorage } from '../../../utils/storage'

const farmerPricingStorageKey = 'direct-market-farmer-pricing'

export function FarmerDashboard() {
    const [forecast, setForecast] = useState<{ demand: string; change: number; confidence: number; recommendedSupply: number } | null>(null)
    const [forecastError, setForecastError] = useState('')
    const [selectedProductId, setSelectedProductId] = useState(products[0].id)
    const [price, setPrice] = useState(String(products[0].price))
    const [stock, setStock] = useState(String(products[0].quantity))
    const [pricingMessage, setPricingMessage] = useState('')
    const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]

    useEffect(() => {
        let active = true
        void aiService.getDemandForecast('tomato-01').then((result) => {
            if (!active) return
            if (result.success) {
                setForecast(result.data)
            } else {
                setForecastError(result.message)
            }
        }).catch(() => {
            if (active) setForecastError('Demand signals are temporarily unavailable.')
        })
        return () => {
            active = false
        }
    }, [])

    const updateProduct = (productId: string) => {
        const product = products.find((item) => item.id === productId) ?? products[0]
        setSelectedProductId(product.id)
        setPrice(String(product.price))
        setStock(String(product.quantity))
        setPricingMessage('')
    }

    const savePricing = () => {
        const numericPrice = Number(price)
        const numericStock = Number(stock)
        if (!Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0) {
            setPricingMessage('Enter a valid price and a whole-number stock quantity.')
            return
        }
        const stored = readStorage<Record<string, { price: number; stock: number }>>(farmerPricingStorageKey, {})
        stored[selectedProduct.id] = { price: numericPrice, stock: numericStock }
        localStorage.setItem(farmerPricingStorageKey, JSON.stringify(stored))
        setPricingMessage('Price and stock saved as farmer-set listing details.')
    }

    return <>
        <DashboardPortal role="Farmer" />
        <section className="farmer-quick-actions">
            <div><p className="eyebrow">FARM WORKSPACE</p><h2>Keep your next harvest moving.</h2><p>Manage listings, stock and demand signals from one place.</p></div>
            <div className="farmer-action-grid">
                <Link to="/farmer/products/new"><Package size={17} /><span><b>Add a product</b><small>List your latest harvest</small></span></Link>
                <Link to="/farmer/inventory"><Boxes size={17} /><span><b>Check inventory</b><small>Review stock and alerts</small></span></Link>
                <Link to="/farmer/ai"><Sparkles size={17} /><span><b>View AI insights</b><small>Plan for demand changes</small></span></Link>
            </div>
        </section>
        <section className="farmer-demand-signal" aria-live="polite">
            <div>
                <p className="eyebrow"><Sparkles size={14} /> BACKGROUND DEMAND SIGNAL</p>
                <h2>Tomato demand forecast</h2>
                {forecast ? <p>AI simulation suggests <strong>{forecast.demand.toLowerCase()} demand</strong> this week, with supply guidance for {forecast.recommendedSupply.toLocaleString()} kg.</p> : <p>{forecastError || 'Loading the latest market signal...'}</p>}
            </div>
            {forecast && <div className="farmer-demand-metrics"><span><b>+{forecast.change}%</b><small>Demand change</small></span><span><b>{forecast.confidence}%</b><small>Confidence</small></span><Link to="/farmer/ai" aria-label="Open AI demand insights"><ArrowUpRight size={18} /></Link></div>}
        </section>
        <section className="farmer-pricing-panel">
            <div>
                <p className="eyebrow">DIRECT PRICING</p>
                <h2>Set your own listing price.</h2>
                <p>Choose a harvest, set the minimum price you expect per unit, and keep available stock current.</p>
            </div>
            <div className="farmer-pricing-form">
                <label>Product<select value={selectedProductId} onChange={(event) => updateProduct(event.target.value)}>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
                <label>Price per {selectedProduct.unit}<input type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
                <label>Available stock ({selectedProduct.unit})<input type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} /></label>
                <button className="primary-button" type="button" onClick={savePricing}>Save farmer price</button>
            </div>
            <div className="farmer-pricing-summary"><span><b>₹{price || '0'}/{selectedProduct.unit}</b><small>Direct from farmer · Price set by producer</small></span><span><b>{stock || '0'} {selectedProduct.unit}</b><small>Available stock</small></span></div>
            {pricingMessage && <p className="farmer-pricing-message" aria-live="polite">{pricingMessage}</p>}
        </section>
    </>
}
