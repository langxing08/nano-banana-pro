/**
 * Creem Webhook 处理 API
 * Requirements: 4.1, 4.2, 4.7
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  handleCheckoutCompleted,
  handleSubscriptionPaid,
  handleSubscriptionCanceled,
  handleSubscriptionExpired,
  handleSubscriptionTrialing,
  type WebhookEvent,
} from '@/lib/creem/webhook-handler'

export async function POST(request: NextRequest) {
  try {
    // 获取原始请求体
    const payload = await request.text()
    
    // 获取签名头
    const signature = request.headers.get('creem-signature') || ''
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET || ''

    // 验证签名
    if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature', code: 'WEBHOOK_INVALID_SIGNATURE' },
        { status: 400 }
      )
    }

    // 解析事件
    const event: WebhookEvent = JSON.parse(payload)
    console.log('Received webhook event:', event.type)

    // 路由到对应的事件处理器
    try {
      switch (event.type) {
        case 'checkout.completed':
          await handleCheckoutCompleted(event.data)
          break

        case 'subscription.paid':
          await handleSubscriptionPaid(event.data)
          break

        case 'subscription.canceled':
          await handleSubscriptionCanceled(event.data)
          break

        case 'subscription.expired':
          await handleSubscriptionExpired(event.data)
          break

        case 'subscription.trialing':
          await handleSubscriptionTrialing(event.data)
          break

        case 'subscription.active':
          // 订阅激活，通常在 checkout.completed 后触发
          console.log('Subscription active event received')
          break

        case 'subscription.update':
          // 订阅更新事件
          console.log('Subscription update event received')
          break

        case 'refund.created':
          console.log('Refund created event received')
          break

        case 'dispute.created':
          console.log('Dispute created event received')
          break

        default:
          console.log('Unhandled webhook event type:', event.type)
      }
    } catch (handlerError) {
      // 记录错误但仍返回 200，防止 Creem 重试无效事件
      console.error('Webhook handler error:', handlerError)
    }

    // 始终返回 200 表示已接收
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // 即使出错也返回 200，防止无限重试
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

// 禁用 body 解析，因为我们需要原始请求体来验证签名
export const config = {
  api: {
    bodyParser: false,
  },
}
