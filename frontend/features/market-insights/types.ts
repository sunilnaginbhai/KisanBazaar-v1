export type InsightKind = 'price' | 'demand' | 'supply' | 'farmers' | 'analytics'

export type InsightFeature = {
  kind: InsightKind
  label: string
  title: string
  description: string
  metric: string
  metricLabel: string
  accent: string
}

export type InsightPoint = { label: string; value: number; secondary: number }
