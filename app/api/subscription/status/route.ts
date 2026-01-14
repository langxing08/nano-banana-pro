/**
 * 获取用户订阅状态 API
 * Requirements: 5.1
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription-service'

export async function GET() {
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

    // 获取用户订阅
    const subscription = await getUserSubscription(user.id)

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    // 返回订阅信息
    return NextResponse.json({
      subscription: {
        id: subscription.id,
        tier: subscription.tier,
        status: subscription.status,
        billingPeriod: subscription.billingPeriod,
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to get subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status', code: 'SUBSCRIPTION_NOT_FOUND' },
      { status: 500 }
    )
  }
}
