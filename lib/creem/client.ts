/**
 * Creem 支付客户端
 * Requirements: 3.3, 6.3
 */

import { createCreem } from 'creem_io'

// 检测是否为测试模式（API key 以 creem_test_ 开头）
const isTestMode = process.env.CREEM_API_KEY?.startsWith('creem_test_') ?? false

// 初始化 Creem SDK
export const creem = createCreem({
  apiKey: process.env.CREEM_API_KEY || '',
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET || '',
  testMode: isTestMode,
})

export interface CreateCheckoutParams {
  productId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl?: string
}

export interface CheckoutResult {
  checkoutUrl: string
  checkoutId: string
}

/**
 * 创建 Creem 结账会话
 * Requirements: 3.3, 6.3
 * 
 * @param params - 结账参数
 * @returns 结账会话信息
 */
export async function createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult> {
  const { productId, userId, userEmail, successUrl, cancelUrl } = params

  console.log('Creating checkout session with:', {
    productId,
    userId,
    userEmail,
    successUrl,
    apiKeyPrefix: process.env.CREEM_API_KEY?.substring(0, 15) + '...',
  })

  try {
    const checkout = await creem.checkouts.create({
      productId,
      customer: {
        email: userEmail,
      },
      successUrl,
      metadata: {
        userId,
      },
    })

    console.log('Checkout created successfully:', checkout.id)

    return {
      checkoutUrl: checkout.checkoutUrl || '',
      checkoutId: checkout.id || '',
    }
  } catch (error: unknown) {
    // 尝试获取更详细的错误信息
    let errorDetails = ''
    if (error instanceof Error) {
      errorDetails = error.message
      // 检查是否有响应体
      if ('response' in error) {
        const response = (error as { response?: { data?: unknown; status?: number } }).response
        console.error('Creem API Response:', {
          status: response?.status,
          data: response?.data,
        })
      }
    } else {
      errorDetails = JSON.stringify(error)
    }
    
    console.error('Failed to create Creem checkout session:', {
      error: errorDetails,
      fullError: error,
      productId,
      apiKeyConfigured: !!process.env.CREEM_API_KEY,
      apiKeyLength: process.env.CREEM_API_KEY?.length,
    })
    throw new Error(`Failed to create checkout session: ${errorDetails}`)
  }
}

/**
 * 获取结账会话信息
 * 
 * @param checkoutId - 结账会话 ID
 * @returns 结账会话信息
 */
export async function getCheckoutSession(checkoutId: string) {
  try {
    const checkout = await creem.checkouts.get({
      checkoutId,
    })
    return checkout
  } catch (error) {
    console.error('Failed to get checkout session:', error)
    throw new Error('Failed to get checkout session')
  }
}

/**
 * 获取订阅信息
 * 
 * @param subscriptionId - 订阅 ID
 * @returns 订阅信息
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await creem.subscriptions.get({
      subscriptionId,
    })
    return subscription
  } catch (error) {
    console.error('Failed to get subscription:', error)
    throw new Error('Failed to get subscription')
  }
}

/**
 * 取消订阅
 * 
 * @param subscriptionId - 订阅 ID
 * @returns 取消后的订阅信息
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await creem.subscriptions.cancel({
      subscriptionId,
    })
    return subscription
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}
