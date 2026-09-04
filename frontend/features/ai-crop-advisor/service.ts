import type { AdvisorInputs, CropAdvice } from './types'

export async function generateCropAdvice(inputs: AdvisorInputs): Promise<CropAdvice> {
  await new Promise((resolve) => window.setTimeout(resolve, 650))
  const isDry = inputs.water === 'Limited' || inputs.weather === 'Dry'
  const crop = inputs.soil === 'Sandy' || isDry ? 'Pearl millet' : inputs.season === 'Winter' ? 'Sharbati wheat' : 'Fresh tomatoes'
  const base = crop === 'Fresh tomatoes' ? 92 : crop === 'Sharbati wheat' ? 78 : 64
  return {
    crop,
    confidence: Math.min(96, base + (inputs.location.trim() ? 3 : 0) + (inputs.weather === 'Balanced' ? 2 : 0)),
    health: isDry ? 'Monitor moisture stress' : 'Strong early growth outlook',
    risk: isDry ? 'Moderate · irrigation timing is critical' : 'Low · conditions are favorable',
    fertilizer: crop === 'Fresh tomatoes' ? 'Apply compost + NPK 10:26:26 at transplanting' : 'Use a balanced NPK base dose with organic matter',
    irrigation: isDry ? 'Drip irrigation every 2–3 days; mulch the root zone' : 'Irrigate deeply twice weekly and adjust after rainfall',
    yield: crop === 'Fresh tomatoes' ? 18.4 : crop === 'Sharbati wheat' ? 14.2 : 9.8,
    revenue: crop === 'Fresh tomatoes' ? 128000 : crop === 'Sharbati wheat' ? 94000 : 68000,
    cost: crop === 'Fresh tomatoes' ? 51000 : crop === 'Sharbati wheat' ? 36000 : 27000,
    chart: [42, 55, 68, 79, 88, 96].map((yieldValue, index) => ({ week: `W${index + 1}`, yield: yieldValue, target: 90 })),
  }
}
