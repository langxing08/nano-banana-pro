import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  calculateYearlySavings,
  calculateYearlyMonthlyPrice,
  isValidYearlyDiscount,
  type PricingTier,
} from './pricing-utils'

/**
 * Feature: image-editor-clone
 * Property 5: 年付价格计算
 * Validates: Requirements 3.2
 */

describe('Pricing Utils - Yearly Price Calculation', () => {
  describe('calculateYearlySavings', () => {
    it('should calculate correct savings percentage', () => {
      // Pro tier: $19.50/month, $117/year (50% off)
      const proTier: PricingTier = { monthlyPrice: 19.5, yearlyPrice: 117 }
      expect(calculateYearlySavings(proTier)).toBe(50)

      // Basic tier: $12/month, $144/year (0% off)
      const basicTier: PricingTier = { monthlyPrice: 12, yearlyPrice: 144 }
      expect(calculateYearlySavings(basicTier)).toBe(0)

      // Max tier: $80/month, $480/year (50% off)
      const maxTier: PricingTier = { monthlyPrice: 80, yearlyPrice: 480 }
      expect(calculateYearlySavings(maxTier)).toBe(50)
    })

    it('should return 0 for no discount', () => {
      const tier: PricingTier = { monthlyPrice: 10, yearlyPrice: 120 }
      expect(calculateYearlySavings(tier)).toBe(0)
    })

    // Property-based test: 节省百分比应该在 0-100 之间
    it('Property: savings percentage should be between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 1, max: 1000, noNaN: true }),
          fc.float({ min: 1, max: 12000, noNaN: true }),
          (monthlyPrice, yearlyPrice) => {
            const tier: PricingTier = { monthlyPrice, yearlyPrice }
            const savings = calculateYearlySavings(tier)
            return savings >= 0 && savings <= 100
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property-based test: 年付价格越低，节省百分比越高
    it('Property: lower yearly price should result in higher savings', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 10, max: 100, noNaN: true }),
          (monthlyPrice) => {
            const monthlyTotal = monthlyPrice * 12
            const tier1: PricingTier = { monthlyPrice, yearlyPrice: monthlyTotal * 0.5 }
            const tier2: PricingTier = { monthlyPrice, yearlyPrice: monthlyTotal * 0.8 }
            
            const savings1 = calculateYearlySavings(tier1)
            const savings2 = calculateYearlySavings(tier2)
            
            return savings1 >= savings2
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('calculateYearlyMonthlyPrice', () => {
    it('should calculate correct monthly price from yearly', () => {
      expect(calculateYearlyMonthlyPrice(120)).toBe(10)
      expect(calculateYearlyMonthlyPrice(144)).toBe(12)
      expect(calculateYearlyMonthlyPrice(117)).toBeCloseTo(9.75)
    })

    // Property-based test: 月均价格 * 12 应该等于年付价格
    it('Property: monthly price * 12 should equal yearly price', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 12, max: 12000, noNaN: true }),
          (yearlyPrice) => {
            const monthlyPrice = calculateYearlyMonthlyPrice(yearlyPrice)
            return Math.abs(monthlyPrice * 12 - yearlyPrice) < 0.01
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('isValidYearlyDiscount', () => {
    it('should return true for valid discounts', () => {
      expect(isValidYearlyDiscount({ monthlyPrice: 10, yearlyPrice: 100 })).toBe(true)
      expect(isValidYearlyDiscount({ monthlyPrice: 10, yearlyPrice: 120 })).toBe(true)
    })

    it('should return false for invalid discounts (yearly > monthly * 12)', () => {
      expect(isValidYearlyDiscount({ monthlyPrice: 10, yearlyPrice: 121 })).toBe(false)
    })

    // Property-based test: 年付价格 <= 月付 * 12 时应该返回 true
    it('Property: yearly <= monthly * 12 should be valid', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 1, max: 100, noNaN: true }),
          fc.float({ min: 0, max: 1, noNaN: true }),
          (monthlyPrice, discountFactor) => {
            const yearlyPrice = monthlyPrice * 12 * discountFactor
            const tier: PricingTier = { monthlyPrice, yearlyPrice }
            return isValidYearlyDiscount(tier) === true
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
