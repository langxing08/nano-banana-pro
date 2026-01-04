'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PricingCardProps {
  tier: 'basic' | 'pro' | 'max'
  name: string
  monthlyPrice: number
  yearlyPrice: number
  credits: number
  features: string[]
  isPopular?: boolean
  isYearly: boolean
  quantityOptions?: number[]
}

/**
 * PricingCard 组件 - 定价卡片
 * Requirements: 3.1, 3.2, 3.4
 */
export function PricingCard({
  tier,
  name,
  monthlyPrice,
  yearlyPrice,
  credits,
  features,
  isPopular = false,
  isYearly,
}: PricingCardProps) {
  // 计算当前价格和节省百分比
  const currentPrice = isYearly ? yearlyPrice / 12 : monthlyPrice
  const yearlyTotal = yearlyPrice
  const monthlyTotal = monthlyPrice * 12
  const savingsPercent = Math.round((1 - yearlyTotal / monthlyTotal) * 100)

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-300',
        isPopular
          ? 'border-primary border-2 shadow-lg scale-105 z-10'
          : 'border-border hover:border-primary/50 hover:shadow-md'
      )}
    >
      {/* Most Popular 标签 */}
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{credits.toLocaleString()} credits/month</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* 价格显示 */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">${currentPrice.toFixed(2)}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          {isYearly && savingsPercent > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Save {savingsPercent}% with yearly billing
            </p>
          )}
          {isYearly && (
            <p className="text-xs text-muted-foreground mt-1">
              Billed ${yearlyPrice}/year
            </p>
          )}
        </div>

        {/* 功能列表 */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={cn(
            'w-full',
            isPopular
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
          size="lg"
        >
          {tier === 'basic' ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardFooter>
    </Card>
  )
}
