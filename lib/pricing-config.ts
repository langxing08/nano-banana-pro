/**
 * 定价配置模块
 * Requirements: 1.2, 1.4, 1.5, 6.1
 */

export type TierType = 'basic' | 'pro' | 'max'
export type BillingPeriod = 'monthly' | 'yearly'

export interface PricingTier {
  id: string
  name: string
  tier: TierType
  monthlyPrice: number
  yearlyPrice: number
  credits: number
  features: string[]
  isPopular?: boolean
  creemProductIds: {
    monthly: string
    yearly: string
  }
}

/**
 * 定价层级配置
 * Requirements: 1.2, 6.1
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    monthlyPrice: 12,
    yearlyPrice: 144,
    credits: 2400,
    features: [
      'All style templates included',
      'Standard generation speed',
      'Basic customer support',
      'JPG/PNG format downloads',
      'Commercial Use License',
    ],
    creemProductIds: {
      monthly: process.env.CREEM_PRODUCT_BASIC_MONTHLY || '',
      yearly: process.env.CREEM_PRODUCT_BASIC_YEARLY || '',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    monthlyPrice: 19.5,
    yearlyPrice: 117,
    credits: 9600,
    isPopular: true,
    features: [
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Priority generation queue',
      'Priority customer support',
      'JPG/PNG/WebP format downloads',
      'Batch generation feature',
      'Image editing tools (Coming in October)',
      'Commercial Use License',
    ],
    creemProductIds: {
      monthly: process.env.CREEM_PRODUCT_PRO_MONTHLY || '',
      yearly: process.env.CREEM_PRODUCT_PRO_YEARLY || '',
    },
  },
  {
    id: 'max',
    name: 'Max',
    tier: 'max',
    monthlyPrice: 80,
    yearlyPrice: 480,
    credits: 43200,
    features: [
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Fastest generation speed',
      'Dedicated account manager',
      'All format downloads',
      'Batch generation feature',
      'Professional editing suite (Coming in October)',
      'Commercial Use License',
    ],
    creemProductIds: {
      monthly: process.env.CREEM_PRODUCT_MAX_MONTHLY || '',
      yearly: process.env.CREEM_PRODUCT_MAX_YEARLY || '',
    },
  },
]

/**
 * 计算年付相对于月付的节省百分比
 * Requirements: 1.5, 2.3
 * 
 * @param monthlyPrice - 月付价格
 * @param yearlyPrice - 年付总价
 * @returns 节省百分比 (0-100)
 */
export function calculateSavingsPercent(monthlyPrice: number, yearlyPrice: number): number {
  if (monthlyPrice <= 0) return 0
  const monthlyTotal = monthlyPrice * 12
  if (monthlyTotal <= 0) return 0
  return Math.round((1 - yearlyPrice / monthlyTotal) * 100)
}

/**
 * 获取显示价格（月度等效价格）
 * Requirements: 1.4
 * 
 * @param tier - 定价层级
 * @param isYearly - 是否年付
 * @returns 月度显示价格
 */
export function getDisplayPrice(tier: PricingTier, isYearly: boolean): number {
  return isYearly ? tier.yearlyPrice / 12 : tier.monthlyPrice
}

/**
 * 获取 Creem 产品 ID
 * Requirements: 6.1
 * 
 * @param tier - 定价层级
 * @param isYearly - 是否年付
 * @returns Creem 产品 ID
 */
export function getProductId(tier: PricingTier, isYearly: boolean): string {
  return isYearly ? tier.creemProductIds.yearly : tier.creemProductIds.monthly
}

/**
 * 根据层级类型获取定价层级
 * 
 * @param tierType - 层级类型
 * @returns 定价层级或 undefined
 */
export function getTierByType(tierType: TierType): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.tier === tierType)
}

/**
 * 获取层级对应的积分数
 * 
 * @param tierType - 层级类型
 * @returns 积分数
 */
export function getCreditsForTier(tierType: TierType): number {
  const tier = getTierByType(tierType)
  return tier?.credits || 0
}

/**
 * 层级优先级映射（用于升级判断）
 */
export const TIER_PRIORITY: Record<TierType, number> = {
  basic: 1,
  pro: 2,
  max: 3,
}
