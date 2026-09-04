import {
  ClipboardList,
  Globe,
  Package,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Impact() {
  const revenue = [
    { month: "Jan", value: 42 }, { month: "Feb", value: 48 }, { month: "Mar", value: 55 },
    { month: "Apr", value: 61 }, { month: "May", value: 70 }, { month: "Jun", value: 82 },
  ];
  const savings = [
    { month: "Jan", savings: 18, orders: 24 }, { month: "Feb", savings: 22, orders: 31 },
    { month: "Mar", savings: 27, orders: 38 }, { month: "Apr", savings: 31, orders: 45 },
    { month: "May", savings: 36, orders: 54 }, { month: "Jun", savings: 42, orders: 63 },
  ];
  return (
    <section className="impact-dashboard">
      <header className="impact-dashboard-hero"><span className="impact-kicker"><Globe size={15} /> Platform Impact Dashboard</span><h1>Measuring Real-World Impact</h1><p>Connecting farmers directly with buyers to create a fairer, more transparent agricultural marketplace.</p><span className="impact-demo-badge">Demo Platform Metrics</span></header>
      <section className="impact-section"><div className="impact-section-heading"><div><p className="eyebrow">ACTUAL DEMO PLATFORM METRICS</p><h2>Network at a glance</h2></div></div><div className="impact-metrics">{[["2,400", "Farmers Connected", "Verified growers on the platform", Users], ["8,420", "Products Listed", "Active harvest listings", Package], ["186", "FPOs Registered", "Farmer organizations onboarded", Users], ["12,840", "Total Orders", "Completed marketplace orders", ClipboardList]].map(([value, label, detail, Icon]) => <article className="impact-metric-card" key={label as string}><span className="impact-card-icon"><Icon size={19} /></span><strong>{value as string}</strong><b>{label as string}</b><small>{detail as string}</small></article>)}</div></section>
      <section className="impact-section"><div className="impact-section-heading"><div><p className="eyebrow">ESTIMATED IMPACT</p><h2>Value created through direct trade</h2></div></div><div className="impact-metrics estimated">{[["₹1.8 Cr", "Farmer Revenue", "Value retained by growers", "+18.4%", WalletCards], ["14.6%", "Consumer Savings", "Average saving per order", "+6.2%", TrendingUp], ["3,860", "Intermediaries Avoided", "Direct buyer connections", "+12.8%", Users], ["3.2×", "Logistics Efficiency", "Better route utilization", "On track", Truck]].map(([value, label, detail, trend, Icon]) => <article className="impact-metric-card" key={label as string}><span className="impact-card-icon"><Icon size={19} /></span><strong>{value as string}</strong><b>{label as string}</b><small>{detail as string}</small><em><TrendingUp size={12} /> {trend as string}</em></article>)}</div></section>
      <section className="impact-section analytics-section"><div className="impact-section-heading"><div><p className="eyebrow">ANALYTICS OVERVIEW</p><h2>Progress over time</h2></div><span className="impact-chart-badge">Demo Data</span></div><div className="impact-charts"><article className="impact-chart-card"><div className="chart-card-heading"><div><h3>Farmer Revenue Growth</h3><p>Estimated monthly revenue retained · ₹ lakh</p></div><span>Estimated</span></div><ResponsiveContainer width="100%" height={250}><AreaChart data={revenue}><CartesianGrid vertical={false} stroke="#e7ede4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="value" stroke="#3f7952" fill="#dfeeda" strokeWidth={3} name="Revenue" /></AreaChart></ResponsiveContainer></article><article className="impact-chart-card"><div className="chart-card-heading"><div><h3>Consumer Savings vs Orders</h3><p>Monthly savings index and completed orders</p></div><span>Demo Data</span></div><ResponsiveContainer width="100%" height={250}><BarChart data={savings}><CartesianGrid vertical={false} stroke="#e7ede4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="savings" fill="#3f7952" radius={[4, 4, 0, 0]} name="Savings" /><Bar dataKey="orders" fill="#e79a57" radius={[4, 4, 0, 0]} name="Orders" /></BarChart></ResponsiveContainer></article></div></section>
      <div className="impact-disclaimer impact-dashboard-disclaimer"><ShieldCheck size={19} /><span><b>About these metrics</b> Calculated from simulated marketplace activity for hackathon demonstration. They are directional estimates, not audited real-world results.</span></div>
    </section>
  );
}
