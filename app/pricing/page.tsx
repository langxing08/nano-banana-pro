'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PricingCard } from '@/components/pricing-card'
import { PricingFAQ } from '@/components/pricing-faq'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import { PRICING_TIERS, type TierType } from '@/lib/pricing-config'

interface SubscriptionStatus {
  tier: TierType
  status: string
  billingPeriod: string
  currentPeriodEnd: string
}

/**
 * 定价页面
 * Requirements: 1.1, 1.3, 2.1, 2.2, 5.1, 5.2
 */
export default function PricingPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState<TierType | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionStatus | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 创建 Supabase 客户端
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 检查认证状态和订阅状态
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)

      if (user) {
        // 获取订阅状态
        try {
          const response = await fetch('/api/subscription/status')
          if (response.ok) {
            const data = await response.json()
            setCurrentSubscription(data.subscription)
          }
        } catch (error) {
          console.error('Failed to fetch subscription status:', error)
        }
      }
    }

    checkAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
      if (!session?.user) {
        setCurrentSubscription(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // 处理订阅按钮点击
  const handleSubscribe = async (tier: TierType) => {
    // 检查是否已登录
    if (!isAuthenticated) {
      // 保存当前页面 URL 以便登录后返回
      const returnUrl = encodeURIComponent(window.location.pathname)
      router.push(`/auth/callback?returnUrl=${returnUrl}`)
      toast.info('Please sign in to subscribe')
      return
    }

    setIsLoading(tier)

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          isYearly,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // 重定向到 Creem 结账页面
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-yellow-50 to-background dark:from-yellow-950/20 dark:to-background">
          <div className="container text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🍌 Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your creative needs. All plans include our core AI features.
            </p>

            {/* 年付折扣横幅 */}
            <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full mb-8">
              <span className="text-sm font-medium">💰 Save up to 50% with yearly billing</span>
            </div>

            {/* 月付/年付切换 */}
            <div className="flex items-center justify-center gap-3">
              <Label
                htmlFor="billing-toggle"
                className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label
                htmlFor="billing-toggle"
                className={isYearly ? 'font-semibold' : 'text-muted-foreground'}
              >
                Yearly
              </Label>
              {isYearly && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                  Save 50%
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 -mt-8">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
              {PRICING_TIERS.map((tier) => (
                <PricingCard
                  key={tier.tier}
                  tier={tier.tier}
                  name={tier.name}
                  monthlyPrice={tier.monthlyPrice}
                  yearlyPrice={tier.yearlyPrice}
                  credits={tier.credits}
                  features={tier.features}
                  isPopular={tier.isPopular}
                  isYearly={isYearly}
                  isCurrentPlan={currentSubscription?.tier === tier.tier}
                  isLoading={isLoading === tier.tier}
                  onSubscribe={() => handleSubscribe(tier.tier)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison Note */}
        <section className="py-8">
          <div className="container text-center">
            <p className="text-sm text-muted-foreground">
              All plans include unlimited access to our web editor and mobile apps.
              <br />
              Need more credits? Contact us for custom enterprise plans.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <PricingFAQ />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
