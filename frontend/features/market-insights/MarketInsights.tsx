import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, LineChart, MapPin, ShieldCheck, Sparkles, Truck, Users } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getInsightFeature, getInsightSeries, insightFeatures } from './service'
import './market-insights.css'

const icons = { price: LineChart, demand: Sparkles, supply: Truck, farmers: Users, analytics: CheckCircle2 }

export function MarketInsights() {
  const { kind } = useParams()
  const feature = getInsightFeature(kind)
  if (!feature) return <section className="insights-page empty-state"><h1>Feature not found</h1><p>This marketplace intelligence view does not exist.</p><Link className="primary-button" to="/features">Back to features <ArrowRight size={15} /></Link></section>
  const Icon = icons[feature.kind]
  const data = getInsightSeries(feature.kind)
  const isBar = feature.kind === 'farmers'
  return <section className="insights-page">
    <div className="insights-hero"><div><p className="eyebrow"><span /> MARKETPLACE INTELLIGENCE</p><h1>{feature.title}</h1><p>{feature.description}</p><div className="insight-hero-actions"><Link className="primary-button" to="/marketplace">Explore marketplace <ArrowRight size={15} /></Link><span><CheckCircle2 size={15} /> Demo data refreshed today</span></div></div><div className="insight-kpi" style={{ '--insight-accent': feature.accent } as CSSProperties}><Icon size={20} /><strong>{feature.metric}</strong><span>{feature.metricLabel}</span></div></div>
    <div className="insight-tabs">{insightFeatures.map((item) => <Link className={item.kind === feature.kind ? 'active' : ''} to={`/features/${item.kind}`} key={item.kind}>{item.label}</Link>)}</div>
    <div className="insight-layout"><div className="insight-panel"><div className="panel-title"><div><p className="eyebrow">{feature.label}</p><h2>{feature.kind === 'price' ? 'Regional price comparison' : feature.kind === 'demand' ? 'Seven-day demand outlook' : feature.kind === 'supply' ? 'Network reliability' : feature.kind === 'farmers' ? 'Verified grower network' : 'Procurement performance'}</h2></div><span className="prototype-label">Live demo</span></div><div className="insight-chart">{isBar ? <ResponsiveContainer width="100%" height={270}><BarChart data={data}><CartesianGrid vertical={false} stroke="#e8ede5" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill={feature.accent} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <ResponsiveContainer width="100%" height={270}><AreaChart data={data}><defs><linearGradient id="insightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={feature.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={feature.accent} stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8ede5" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="value" stroke={feature.accent} fill="url(#insightFill)" strokeWidth={2.5} /><Area type="monotone" dataKey="secondary" stroke="#b8c1b5" fill="none" strokeDasharray="4 4" /></AreaChart></ResponsiveContainer>}</div></div>
      <aside className="insight-panel insight-checklist"><p className="eyebrow">NEXT BEST ACTIONS</p><h2>Stay one step ahead.</h2><div><CheckCircle2 size={17} /><span>Verified data from {feature.kind === 'farmers' ? 'grower profiles' : 'your marketplace activity'}</span></div><div><ShieldCheck size={17} /><span>Transparent signals for confident decisions</span></div><div><MapPin size={17} /><span>Regional context across the supply network</span></div><button className="secondary-button">Download summary <ArrowRight size={14} /></button></aside></div>
  </section>
}

export function FeatureHub() {
  return <section className="insights-page feature-hub"><p className="eyebrow"><span /> ONE MARKETPLACE, CLEARER DECISIONS</p><h1>Tools for a fairer food chain.</h1><p className="hub-intro">Five connected views to help farmers, buyers and operators plan with confidence.</p><div className="feature-grid">{insightFeatures.map((feature) => { const Icon = icons[feature.kind]; return <Link className="feature-tile" to={`/features/${feature.kind}`} key={feature.kind}><Icon size={21} /><span>{feature.label}</span><h2>{feature.title}</h2><p>{feature.description}</p><b>Open feature <ArrowRight size={14} /></b></Link> })}</div></section>
}
