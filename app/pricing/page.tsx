'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PricingCard } from '@/components/pricing-card'
import { PricingFAQ } from '@/components/pricing-faq'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// 定价层级数据
const pricingTiers = [
  {
    tier: 'basic' as const,
    name: 'Basic',
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
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    monthlyPrice: 19.5,
    yearlyPrice: 117, // 50% off yearly
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
  },
  {
    tier: 'max' as const,
    name: 'Max',
    monthlyPrice: 80,
    yearlyPrice: 480, // 50% off yearly
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
  },
]

/**
 * 定价页面
 * Requirements: 3.1-3.7
 */
export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

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
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.tier}
                  {...tier}
                  isYearly={isYearly}
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
