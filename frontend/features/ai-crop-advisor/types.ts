export type AdvisorInputs = {
  soil: string
  season: string
  location: string
  weather: string
  water: string
}

export type CropAdvice = {
  crop: string
  confidence: number
  health: string
  risk: string
  fertilizer: string
  irrigation: string
  yield: number
  revenue: number
  cost: number
  chart: Array<{ week: string; yield: number; target: number }>
}
