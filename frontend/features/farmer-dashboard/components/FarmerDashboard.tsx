import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Boxes, Package, Sparkles } from 'lucide-react'
import { DashboardPortal } from '../../portal/DashboardPortal'
import { aiService } from '../../../services/aiService'

export function FarmerDashboard() {
    const [forecast, setForecast] = useState<{ demand: string; change: number; confidence: number; recommendedSupply: number } | null>(null)
    const [forecastError, setForecastError] = useState('')

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
    </>
}
