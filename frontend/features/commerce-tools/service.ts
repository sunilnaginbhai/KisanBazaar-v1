const compareKey = 'direct-market-compare'
const recentKey = 'direct-market-recent'
const couponKey = 'direct-market-coupon'

function readIds(key: string) {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as string[] } catch { return [] }
}

function writeIds(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids))
}

export function getCompareIds() { return readIds(compareKey) }
export function toggleCompare(id: string) {
  const ids = getCompareIds()
  writeIds(compareKey, ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id].slice(-3))
  return !ids.includes(id)
}
export function getRecentIds() { return readIds(recentKey) }
export function recordRecent(id: string) { writeIds(recentKey, [id, ...getRecentIds().filter((item) => item !== id)].slice(0, 5)) }
export function getCoupon() { return localStorage.getItem(couponKey) }
export function getCouponRate() { return getCoupon() ? 0.1 : 0 }
export function applyCoupon(code: string) {
  const normalized = code.trim().toUpperCase()
  if (normalized !== 'FARM10' && normalized !== 'FIRSTBUY') return false
  localStorage.setItem(couponKey, normalized)
  return true
}
