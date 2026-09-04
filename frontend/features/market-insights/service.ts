import type { InsightFeature, InsightKind, InsightPoint } from './types'

export const insightFeatures: InsightFeature[] = [
  { kind: 'price', label: 'Price intelligence', title: 'Buy with market context.', description: 'Compare regional mandi signals with direct farmer offers before you commit volume.', metric: '18%', metricLabel: 'average buyer saving', accent: '#d97752' },
  { kind: 'demand', label: 'Demand forecasting', title: 'Plan the next harvest.', description: 'Turn order history and seasonal signals into a practical seven-day demand outlook.', metric: '+24%', metricLabel: 'mango demand forecast', accent: '#789b46' },
  { kind: 'supply', label: 'Supply chain control', title: 'Every shipment, visible.', description: 'See route health, temperature checks and delivery milestones in one operational view.', metric: '92%', metricLabel: 'on-time shipments', accent: '#4e8490' },
  { kind: 'farmers', label: 'Farmer directory', title: 'Know who grows it.', description: 'Discover verified farmers and FPOs by region, crop and responsible growing practices.', metric: '2,400', metricLabel: 'verified growers', accent: '#8c6e54' },
  { kind: 'analytics', label: 'Procurement analytics', title: 'Make every rupee count.', description: 'Measure spend, fulfillment and regional performance across your procurement network.', metric: '₹18.4L', metricLabel: 'tracked transaction value', accent: '#6f7ba1' },
]

const series: Record<InsightKind, InsightPoint[]> = {
  price: [{ label: 'Nashik', value: 28, secondary: 34 }, { label: 'Pune', value: 31, secondary: 36 }, { label: 'Mumbai', value: 35, secondary: 40 }, { label: 'Delhi', value: 39, secondary: 43 }, { label: 'Bengaluru', value: 42, secondary: 45 }],
  demand: [{ label: 'Mon', value: 58, secondary: 42 }, { label: 'Tue', value: 64, secondary: 45 }, { label: 'Wed', value: 62, secondary: 48 }, { label: 'Thu', value: 73, secondary: 51 }, { label: 'Fri', value: 82, secondary: 55 }, { label: 'Sat', value: 91, secondary: 59 }],
  supply: [{ label: 'Nashik', value: 92, secondary: 78 }, { label: 'Pune', value: 88, secondary: 74 }, { label: 'Mumbai', value: 95, secondary: 81 }, { label: 'Surat', value: 86, secondary: 70 }],
  farmers: [{ label: 'Maharashtra', value: 680, secondary: 420 }, { label: 'Karnataka', value: 510, secondary: 330 }, { label: 'Gujarat', value: 450, secondary: 290 }, { label: 'Punjab', value: 320, secondary: 210 }],
  analytics: [{ label: 'Apr', value: 42, secondary: 31 }, { label: 'May', value: 55, secondary: 37 }, { label: 'Jun', value: 51, secondary: 43 }, { label: 'Jul', value: 68, secondary: 49 }, { label: 'Aug', value: 82, secondary: 57 }],
}

export function getInsightFeature(kind?: string) {
  return insightFeatures.find((feature) => feature.kind === kind)
}

export function getInsightSeries(kind: InsightKind) {
  return series[kind]
}
