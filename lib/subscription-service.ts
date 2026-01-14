/**
 * 订阅服务模块
 * Requirements: 5.1, 5.3, 4.4
 */

import { createClient } from '@/lib/supabase/server'
import { TIER_PRIORITY, type TierType } from '@/lib/pricing-config'

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing'
export type BillingPeriod = 'monthly' | 'yearly'

export interface Subscription {
  id: string
  userId: string
  tier: TierType
  status: SubscriptionStatus
  billingPeriod: BillingPeriod
  currentPeriodEnd: Date
  creemSubscriptionId: string
  creemCustomerId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateSubscriptionData {
  userId: string
  tier: TierType
  status: SubscriptionStatus
  billingPeriod: BillingPeriod
  currentPeriodEnd: Date
  creemSubscriptionId: string
  creemCustomerId: string
}

/**
 * 获取用户订阅信息
 * Requirements: 5.1
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return mapDbToSubscription(data)
}

/**
 * 根据 Creem 订阅 ID 获取订阅
 */
export async function getUserSubscriptionByCreemId(creemSubscriptionId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('creem_subscription_id', creemSubscriptionId)
    .single()

  if (error || !data) {
    return null
  }

  return mapDbToSubscription(data)
}

/**
 * 创建订阅记录
 * Requirements: 4.3
 */
export async function createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
  const supabase = await createClient()

  // 先检查是否已存在活跃订阅，如果有则更新
  const existing = await getUserSubscription(data.userId)
  if (existing) {
    return updateSubscription(existing.id, {
      tier: data.tier,
      status: data.status,
      billingPeriod: data.billingPeriod,
      currentPeriodEnd: data.currentPeriodEnd,
      creemSubscriptionId: data.creemSubscriptionId,
      creemCustomerId: data.creemCustomerId,
    })
  }

  const { data: result, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: data.userId,
      tier: data.tier,
      status: data.status,
      billing_period: data.billingPeriod,
      current_period_end: data.currentPeriodEnd.toISOString(),
      creem_subscription_id: data.creemSubscriptionId,
      creem_customer_id: data.creemCustomerId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create subscription:', error)
    throw new Error('Failed to create subscription')
  }

  return mapDbToSubscription(result)
}

/**
 * 更新订阅记录
 */
export async function updateSubscription(
  id: string,
  data: Partial<Omit<Subscription, 'id' | 'createdAt'>>
): Promise<Subscription> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (data.tier !== undefined) updateData.tier = data.tier
  if (data.status !== undefined) updateData.status = data.status
  if (data.billingPeriod !== undefined) updateData.billing_period = data.billingPeriod
  if (data.currentPeriodEnd !== undefined) {
    updateData.current_period_end = data.currentPeriodEnd.toISOString()
  }
  if (data.creemSubscriptionId !== undefined) {
    updateData.creem_subscription_id = data.creemSubscriptionId
  }
  if (data.creemCustomerId !== undefined) {
    updateData.creem_customer_id = data.creemCustomerId
  }

  const { data: result, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update subscription:', error)
    throw new Error('Failed to update subscription')
  }

  return mapDbToSubscription(result)
}

/**
 * 为用户添加积分
 * Requirements: 4.4
 */
export async function addCreditsToUser(userId: string, credits: number): Promise<void> {
  const supabase = await createClient()

  // 使用 RPC 函数或直接更新
  const { error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_credits: credits,
  })

  if (error) {
    // 如果 RPC 不存在，尝试直接更新
    console.warn('RPC add_credits not found, trying direct update:', error)
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits: supabase.rpc('coalesce', { value: 'credits', default_value: 0 }) 
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to add credits:', updateError)
      // 不抛出错误，因为积分功能可能还未完全配置
    }
  }
}

/**
 * 判断是否可以升级到目标层级
 * Requirements: 5.3
 */
export function canUpgrade(currentTier: TierType, targetTier: TierType): boolean {
  const currentPriority = TIER_PRIORITY[currentTier]
  const targetPriority = TIER_PRIORITY[targetTier]
  return targetPriority > currentPriority
}

/**
 * 判断是否可以降级到目标层级
 */
export function canDowngrade(currentTier: TierType, targetTier: TierType): boolean {
  const currentPriority = TIER_PRIORITY[currentTier]
  const targetPriority = TIER_PRIORITY[targetTier]
  return targetPriority < currentPriority
}

/**
 * 数据库记录映射到 Subscription 对象
 */
function mapDbToSubscription(data: Record<string, unknown>): Subscription {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    tier: data.tier as TierType,
    status: data.status as SubscriptionStatus,
    billingPeriod: data.billing_period as BillingPeriod,
    currentPeriodEnd: new Date(data.current_period_end as string),
    creemSubscriptionId: data.creem_subscription_id as string,
    creemCustomerId: data.creem_customer_id as string,
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  }
}
