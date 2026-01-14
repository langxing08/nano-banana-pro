/**
 * Creem Webhook 处理器
 * Requirements: 4.1, 4.3, 4.4, 4.5, 4.6
 */

import crypto from 'crypto'
import { createSubscription, updateSubscription, addCreditsToUser, getUserSubscriptionByCreemId } from '@/lib/subscription-service'
import { getCreditsForTier, PRICING_TIERS, type TierType } from '@/lib/pricing-config'

export interface WebhookEventData {
  customer?: {
    email: string
    id: string
  }
  subscription?: {
    id: string
    status: string
  }
  metadata?: {
    userId?: string
  }
  product?: {
    id: string
  }
  order?: {
    type: string
  }
}

export interface WebhookEvent {
  type: string
  data: WebhookEventData
}

/**
 * 验证 Webhook 签名
 * Requirements: 4.1
 * 
 * @param payload - 原始请求体
 * @param signature - Creem 签名头
 * @param secret - Webhook 密钥
 * @returns 签名是否有效
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!payload || !signature || !secret) {
    return false
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * 根据产品 ID 获取层级类型
 */
function getTierFromProductId(productId: string): TierType | null {
  for (const tier of PRICING_TIERS) {
    if (
      tier.creemProductIds.monthly === productId ||
      tier.creemProductIds.yearly === productId
    ) {
      return tier.tier
    }
  }
  return null
}

/**
 * 根据产品 ID 获取计费周期
 */
function getBillingPeriodFromProductId(productId: string): 'monthly' | 'yearly' | null {
  for (const tier of PRICING_TIERS) {
    if (tier.creemProductIds.monthly === productId) {
      return 'monthly'
    }
    if (tier.creemProductIds.yearly === productId) {
      return 'yearly'
    }
  }
  return null
}

/**
 * 处理 checkout.completed 事件
 * Requirements: 4.3
 */
export async function handleCheckoutCompleted(data: WebhookEventData): Promise<void> {
  const userId = data.metadata?.userId
  const subscriptionId = data.subscription?.id
  const customerId = data.customer?.id
  const productId = data.product?.id

  if (!userId || !subscriptionId || !productId) {
    console.error('Missing required data in checkout.completed event:', { userId, subscriptionId, productId })
    return
  }

  const tier = getTierFromProductId(productId)
  const billingPeriod = getBillingPeriodFromProductId(productId)

  if (!tier || !billingPeriod) {
    console.error('Unknown product ID:', productId)
    return
  }

  // 计算订阅结束时间
  const currentPeriodEnd = new Date()
  if (billingPeriod === 'monthly') {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
  } else {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
  }

  // 创建订阅记录
  await createSubscription({
    userId,
    tier,
    status: 'active',
    billingPeriod,
    currentPeriodEnd,
    creemSubscriptionId: subscriptionId,
    creemCustomerId: customerId || '',
  })

  // 添加积分
  const credits = getCreditsForTier(tier)
  await addCreditsToUser(userId, credits)

  console.log(`Subscription created for user ${userId}: ${tier} (${billingPeriod})`)
}

/**
 * 处理 subscription.paid 事件
 * Requirements: 4.4
 */
export async function handleSubscriptionPaid(data: WebhookEventData): Promise<void> {
  const subscriptionId = data.subscription?.id
  const productId = data.product?.id

  if (!subscriptionId) {
    console.error('Missing subscription ID in subscription.paid event')
    return
  }

  // 获取现有订阅
  const subscription = await getUserSubscriptionByCreemId(subscriptionId)
  if (!subscription) {
    console.error('Subscription not found:', subscriptionId)
    return
  }

  // 计算新的订阅结束时间
  const currentPeriodEnd = new Date()
  if (subscription.billingPeriod === 'monthly') {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
  } else {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
  }

  // 更新订阅状态
  await updateSubscription(subscription.id, {
    status: 'active',
    currentPeriodEnd,
  })

  // 添加积分
  const credits = getCreditsForTier(subscription.tier)
  await addCreditsToUser(subscription.userId, credits)

  console.log(`Subscription renewed for user ${subscription.userId}`)
}

/**
 * 处理 subscription.canceled 事件
 * Requirements: 4.5
 */
export async function handleSubscriptionCanceled(data: WebhookEventData): Promise<void> {
  const subscriptionId = data.subscription?.id

  if (!subscriptionId) {
    console.error('Missing subscription ID in subscription.canceled event')
    return
  }

  const subscription = await getUserSubscriptionByCreemId(subscriptionId)
  if (!subscription) {
    console.error('Subscription not found:', subscriptionId)
    return
  }

  await updateSubscription(subscription.id, {
    status: 'canceled',
  })

  console.log(`Subscription canceled for user ${subscription.userId}`)
}

/**
 * 处理 subscription.expired 事件
 * Requirements: 4.6
 */
export async function handleSubscriptionExpired(data: WebhookEventData): Promise<void> {
  const subscriptionId = data.subscription?.id

  if (!subscriptionId) {
    console.error('Missing subscription ID in subscription.expired event')
    return
  }

  const subscription = await getUserSubscriptionByCreemId(subscriptionId)
  if (!subscription) {
    console.error('Subscription not found:', subscriptionId)
    return
  }

  await updateSubscription(subscription.id, {
    status: 'expired',
  })

  console.log(`Subscription expired for user ${subscription.userId}`)
}

/**
 * 处理 subscription.trialing 事件
 */
export async function handleSubscriptionTrialing(data: WebhookEventData): Promise<void> {
  const subscriptionId = data.subscription?.id

  if (!subscriptionId) {
    console.error('Missing subscription ID in subscription.trialing event')
    return
  }

  const subscription = await getUserSubscriptionByCreemId(subscriptionId)
  if (!subscription) {
    console.error('Subscription not found:', subscriptionId)
    return
  }

  await updateSubscription(subscription.id, {
    status: 'trialing',
  })

  console.log(`Subscription trialing for user ${subscription.userId}`)
}
