import { ArrowRight, BarChart3, Bot, Boxes, ChartNoAxesCombined, CreditCard, Leaf, LogIn, PackageSearch, ShieldCheck, Star, Truck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import type { Session } from '../../services/authService'
import './feature-directory.css'

const features = [
  { title: 'Marketplace', description: 'Search, filter, compare and buy verified harvests.', href: '/marketplace', icon: PackageSearch, public: true },
  { title: 'AI Crop Advisor', description: 'Turn field conditions into a practical crop plan.', href: '/ai-crop-advisor', icon: Bot },
  { title: 'Reviews & ratings', description: 'Use verified buyer feedback before ordering.', href: '/reviews', icon: Star },
  { title: 'Order tracking', description: 'Follow delivery progress from farm to door.', href: '/orders/DM-2048', icon: Truck },
  { title: 'Checkout', description: 'Complete address, delivery and payment steps.', href: '/checkout', icon: CreditCard },
  { title: 'Saved favorites', description: 'Return to products and farmers you trust.', href: '/buyer/favorites', icon: Star },
  { title: 'Logistics dashboard', description: 'See active routes and supply chain movement.', href: '/logistics', icon: Truck },
  { title: 'Sign in & register', description: 'Choose a role and access the right workspace.', href: '/login', icon: LogIn },
  { title: 'Market intelligence', description: 'Explore price, demand and supply signals.', href: '/features', icon: ChartNoAxesCombined },
  { title: 'Farmer workspace', description: 'Manage products, inventory, orders and earnings.', href: '/farmer/dashboard', icon: Leaf },
  { title: 'Buyer workspace', description: 'Review orders, favorites and recommendations.', href: '/buyer/dashboard', icon: Users },
  { title: 'Admin control centre', description: 'Monitor users, products, logistics and analytics.', href: '/admin/dashboard', icon: BarChart3 },
]

export function FeatureDirectory() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    let active = true
    void authService.getCurrentUser().then((currentSession) => {
      if (!active) return
      setSession(currentSession)
      setSessionReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  const canAccess = (isPublic?: boolean) => Boolean(isPublic || session)

  return <section className="feature-directory"><div className="feature-directory-hero"><div><p className="eyebrow"><span /> DIRECT MARKET TOOLKIT</p><h1>Everything you need<br /><i>to move with confidence.</i></h1><p>Explore marketplace workflows, insights, and role workspaces from one place.</p></div><div className="feature-directory-proof"><ShieldCheck size={20} /><span><b>{session ? 'Authenticated workspace' : 'Secure role-based access'}</b><small>{session ? `Signed in as ${session.name}` : 'Sign in to unlock protected tools'}</small></span></div></div><div className="feature-directory-grid">{features.map(({ title, description, href, icon: Icon, public: isPublic }) => { const accessible = canAccess(isPublic); return <Link className="feature-directory-card" to={accessible ? href : '/login'} key={title}><span className="feature-directory-icon"><Icon size={19} /></span><h2>{title}</h2><p>{description}</p><b>{accessible ? 'Open feature' : 'Sign in required'} {accessible ? <ArrowRight size={14} /> : <LogIn size={14} />}</b></Link> })}</div><div className="feature-directory-note"><Boxes size={18} /><span>{sessionReady && session ? 'Your authenticated session unlocks protected tools. Role-specific workspaces still follow their assigned permissions.' : 'Protected tools keep orders, profiles, analytics, and role workspaces private.'}</span>{!session && <Link to="/login">Sign in to continue <ArrowRight size={14} /></Link>}</div></section>
}
