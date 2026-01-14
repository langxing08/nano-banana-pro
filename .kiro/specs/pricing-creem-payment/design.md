# Design Document: Pricing Page with Creem Payment Integration

## Overview

本设计实现一个完整的定价页面和 Creem 支付集成系统。系统包含前端定价页面组件、后端 API 路由（创建结账会话）、Webhook 处理器（处理支付事件）以及用户订阅状态管理。

### 技术栈
- **前端**: Next.js 14 App Router, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **支付**: Creem SDK (creem_io)
- **数据库**: Supabase (已集成)
- **认证**: Supabase Auth (已集成)

## Architecture

```mermaid
flowchart TB
    subgraph Frontend
        PP[Pricing Page]
        PC[PricingCard Component]
        BT[Billing Toggle]
    end
    
    subgraph API Routes
        CA[/api/checkout/create]
        WH[/api/webhooks/creem]
        SS[/api/subscription/status]
    end
    
    subgraph External
        CREEM[Creem API]
        CHECKOUT[Creem Checkout Page]
    end
    
    subgraph Database
        SUB[subscriptions table]
        USERS[users table]
    end
    
    PP --> PC
    PP --> BT
    PC -->|Subscribe Click| CA
    CA -->|Create Session| CREEM
    CREEM -->|Checkout URL| CA
    CA -->|Redirect| CHECKOUT
    CHECKOUT -->|Success/Cancel| PP
    CREEM -->|Webhook Events| WH
    WH -->|Update| SUB
    WH -->|Update Credits| USERS
    PP -->|Fetch Status| SS
    SS -->|Query| SUB
```

## Components and Interfaces

### 1. 定价配置 (lib/pricing-config.ts)

```typescript
export interface PricingTier {
  id: string
  name: string
  tier: 'basic' | 'pro' | 'max'
  monthlyPrice: number
  yearlyPrice: number
  credits: number
  features: string[]
  isPopular?: boolean
  creemProductIds: {
    monthly: string
    yearly: string
  }
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    monthlyPrice: 12,
    yearlyPrice: 144,
    credits: 2400,
    features: [...],
    creemProductIds: {
      monthly: process.env.CREEM_PRODUCT_BASIC_MONTHLY!,
      yearly: process.env.CREEM_PRODUCT_BASIC_YEARLY!,
    }
  },
  // Pro and Max tiers...
]

export function calculateSavingsPercent(monthlyPrice: number, yearlyPrice: number): number
export function getDisplayPrice(tier: PricingTier, isYearly: boolean): number
export function getProductId(tier: PricingTier, isYearly: boolean): string
```

### 2. Creem 客户端 (lib/creem/client.ts)

```typescript
import { createCreem } from 'creem_io'

export const creem = createCreem({
  apiKey: process.env.CREEM_API_KEY!,
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
})

export interface CreateCheckoutParams {
  productId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl?: string
}

export async function createCheckoutSession(params: CreateCheckoutParams): Promise<{
  checkoutUrl: string
  checkoutId: string
}>
```

### 3. Webhook 处理器 (lib/creem/webhook-handler.ts)

```typescript
export interface WebhookEvent {
  type: string
  data: {
    customer?: { email: string; id: string }
    subscription?: { id: string; status: string }
    metadata?: { userId: string }
    product?: { id: string }
  }
}

export async function handleCheckoutCompleted(data: WebhookEvent['data']): Promise<void>
export async function handleSubscriptionPaid(data: WebhookEvent['data']): Promise<void>
export async function handleSubscriptionCanceled(data: WebhookEvent['data']): Promise<void>
export async function handleSubscriptionExpired(data: WebhookEvent['data']): Promise<void>
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean
```

### 4. 订阅服务 (lib/subscription-service.ts)

```typescript
export interface Subscription {
  id: string
  userId: string
  tier: 'basic' | 'pro' | 'max'
  status: 'active' | 'canceled' | 'expired' | 'trialing'
  billingPeriod: 'monthly' | 'yearly'
  currentPeriodEnd: Date
  creemSubscriptionId: string
  creemCustomerId: string
  createdAt: Date
  updatedAt: Date
}

export async function getUserSubscription(userId: string): Promise<Subscription | null>
export async function createSubscription(data: Partial<Subscription>): Promise<Subscription>
export async function updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription>
export async function addCreditsToUser(userId: string, credits: number): Promise<void>
export function canUpgrade(currentTier: string, targetTier: string): boolean
```

## Data Models

### Supabase Schema

```sql
-- subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'max')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trialing')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  current_period_end TIMESTAMPTZ NOT NULL,
  creem_subscription_id TEXT UNIQUE,
  creem_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add credits column to users profile if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Price Calculation Correctness

*For any* pricing tier with monthly and yearly prices, the calculated savings percentage SHALL equal `Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100)`, and the display price for yearly billing SHALL equal `yearlyPrice / 12`.

**Validates: Requirements 1.4, 1.5, 2.3**

### Property 2: Pricing Card Rendering Completeness

*For any* pricing tier data object, the rendered pricing card output SHALL contain the tier name, the formatted price, the credits count, and all feature strings from the tier's feature list.

**Validates: Requirements 1.2**

### Property 3: Checkout Session Creation Correctness

*For any* valid user ID, product ID, and success URL, the created Creem checkout session SHALL include the user ID in metadata and use the correct product ID for the selected tier and billing period.

**Validates: Requirements 3.3, 6.3**

### Property 4: Webhook Signature Verification

*For any* webhook payload and secret, computing `HMAC-SHA256(payload, secret)` and comparing with the provided signature SHALL correctly identify valid signatures (return true) and reject invalid signatures (return false).

**Validates: Requirements 4.1**

### Property 5: Webhook Event State Transitions

*For any* valid webhook event of type checkout.completed, subscription.paid, subscription.canceled, or subscription.expired, processing the event SHALL result in the correct subscription status update and return HTTP 200.

**Validates: Requirements 4.3, 4.4, 4.5, 4.6, 4.7**

### Property 6: Product Configuration Completeness

*For any* pricing tier in the configuration, there SHALL exist valid Creem product IDs for both monthly and yearly billing periods.

**Validates: Requirements 6.1**

### Property 7: Upgrade Availability Logic

*For any* user with an active subscription, the `canUpgrade` function SHALL return true only when the target tier is higher than the current tier (basic < pro < max).

**Validates: Requirements 5.3**

## Error Handling

### API Error Responses

```typescript
interface ApiError {
  error: string
  code: string
  details?: string
}

// Error codes
const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_PRODUCT: 'INVALID_PRODUCT',
  CHECKOUT_FAILED: 'CHECKOUT_FAILED',
  WEBHOOK_INVALID_SIGNATURE: 'WEBHOOK_INVALID_SIGNATURE',
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
}
```

### Error Handling Strategy

1. **API Route Errors**: 返回适当的 HTTP 状态码和 JSON 错误响应
2. **Webhook Errors**: 记录错误但返回 HTTP 200 防止无效重试
3. **Frontend Errors**: 使用 toast 通知显示用户友好的错误消息
4. **Creem API Errors**: 捕获并转换为内部错误格式

## Testing Strategy

### Unit Tests

使用 Vitest 进行单元测试：

1. **价格计算测试**: 测试 `calculateSavingsPercent` 和 `getDisplayPrice` 函数
2. **产品配置测试**: 验证所有层级都有完整的产品 ID 配置
3. **升级逻辑测试**: 测试 `canUpgrade` 函数的各种场景

### Property-Based Tests

使用 fast-check 进行属性测试：

1. **Property 1**: 生成随机价格数据，验证计算正确性
2. **Property 4**: 生成随机 payload 和 secret，验证签名验证
3. **Property 7**: 生成随机层级组合，验证升级逻辑

### Integration Tests

1. **Checkout Flow**: 模拟完整的结账流程
2. **Webhook Processing**: 模拟各种 webhook 事件的处理

### Test Configuration

```typescript
// vitest.config.ts 已配置
// 每个属性测试运行至少 100 次迭代
// 测试标签格式: Feature: pricing-creem-payment, Property N: {property_text}
```
