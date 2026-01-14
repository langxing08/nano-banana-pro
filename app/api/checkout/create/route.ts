/**
 * 创建 Creem 结账会话 API
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/creem/client'
import { PRICING_TIERS, getProductId, type TierType } from '@/lib/pricing-config'

interface CheckoutRequest {
  tier: TierType
  isYearly: boolean
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证状态
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // 解析请求体
    const body: CheckoutRequest = await request.json()
    const { tier, isYearly } = body

    // 验证层级
    const pricingTier = PRICING_TIERS.find(t => t.tier === tier)
    if (!pricingTier) {
      return NextResponse.json(
        { error: 'Invalid pricing tier', code: 'INVALID_PRODUCT' },
        { status: 400 }
      )
    }

    // 获取产品 ID
    const productId = getProductId(pricingTier, isYearly)
    if (!productId) {
      return NextResponse.json(
        { error: 'Product not configured', code: 'INVALID_PRODUCT' },
        { status: 400 }
      )
    }

    // 构建回调 URL - 使用请求的 origin 以保持同一域名，避免 cookie 丢失
    // 在开发环境中，用户可能从 localhost 访问，需要重定向回 localhost
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || ''
    const successUrl = `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${origin}/pricing/cancel`

    // 创建结账会话
    const checkout = await createCheckoutSession({
      productId,
      userId: user.id,
      userEmail: user.email || '',
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.checkoutId,
    })
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', code: 'CHECKOUT_FAILED' },
      { status: 500 }
    )
  }
}
