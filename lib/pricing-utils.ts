/**
 * 定价计算工具函数
 * Requirements: 3.2
 */

export interface PricingTier {
  monthlyPrice: number
  yearlyPrice: number
}

/**
 * 计算年付节省百分比
 */
export function calculateYearlySavings(tier: PricingTier): number {
  const monthlyTotal = tier.monthlyPrice * 12
  const savingsPercent = Math.round((1 - tier.yearlyPrice / monthlyTotal) * 100)
  return Math.max(0, savingsPercent) // 确保不返回负数
}

/**
 * 计算年付月均价格
 */
export function calculateYearlyMonthlyPrice(yearlyPrice: number): number {
  return yearlyPrice / 12
}

/**
 * 验证年付价格是否正确（应该小于等于月付 * 12）
 */
export function isValidYearlyDiscount(tier: PricingTier): boolean {
  return tier.yearlyPrice <= tier.monthlyPrice * 12
}
