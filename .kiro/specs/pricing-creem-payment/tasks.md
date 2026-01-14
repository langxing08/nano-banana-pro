# Implementation Plan: Pricing Page with Creem Payment Integration

## Overview

本实现计划将定价页面和 Creem 支付集成分解为可执行的编码任务。任务按依赖顺序排列，从基础配置开始，逐步构建完整的支付流程。

## Tasks

- [x] 1. 安装依赖和基础配置
  - [x] 1.1 安装 Creem SDK 和相关依赖
    - 运行 `pnpm add creem_io`
    - 添加 fast-check 用于属性测试 `pnpm add -D fast-check`
    - _Requirements: 6.2_

  - [x] 1.2 创建环境变量配置
    - 在 `.env.local` 添加 Creem 相关环境变量模板
    - CREEM_API_KEY, CREEM_WEBHOOK_SECRET
    - CREEM_PRODUCT_BASIC_MONTHLY, CREEM_PRODUCT_BASIC_YEARLY
    - CREEM_PRODUCT_PRO_MONTHLY, CREEM_PRODUCT_PRO_YEARLY
    - CREEM_PRODUCT_MAX_MONTHLY, CREEM_PRODUCT_MAX_YEARLY
    - _Requirements: 6.2, 6.4_

- [x] 2. 实现定价配置模块
  - [x] 2.1 创建 lib/pricing-config.ts
    - 定义 PricingTier 接口
    - 实现 PRICING_TIERS 配置数组
    - 实现 calculateSavingsPercent 函数
    - 实现 getDisplayPrice 函数
    - 实现 getProductId 函数
    - _Requirements: 1.2, 1.4, 1.5, 6.1_

  - [ ]* 2.2 编写价格计算属性测试
    - **Property 1: Price Calculation Correctness**
    - **Validates: Requirements 1.4, 1.5, 2.3**

  - [ ]* 2.3 编写产品配置完整性属性测试
    - **Property 6: Product Configuration Completeness**
    - **Validates: Requirements 6.1**

- [x] 3. 实现 Creem 客户端模块
  - [x] 3.1 创建 lib/creem/client.ts
    - 初始化 Creem SDK
    - 实现 createCheckoutSession 函数
    - 包含 userId 在 metadata 中
    - _Requirements: 3.3, 6.3_

  - [ ]* 3.2 编写结账会话创建属性测试
    - **Property 3: Checkout Session Creation Correctness**
    - **Validates: Requirements 3.3, 6.3**

- [x] 4. 实现 Webhook 处理模块
  - [x] 4.1 创建 lib/creem/webhook-handler.ts
    - 实现 verifyWebhookSignature 函数 (HMAC-SHA256)
    - 实现 handleCheckoutCompleted 函数
    - 实现 handleSubscriptionPaid 函数
    - 实现 handleSubscriptionCanceled 函数
    - 实现 handleSubscriptionExpired 函数
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 4.2 编写 Webhook 签名验证属性测试
    - **Property 4: Webhook Signature Verification**
    - **Validates: Requirements 4.1**

  - [ ]* 4.3 编写 Webhook 事件处理属性测试
    - **Property 5: Webhook Event State Transitions**
    - **Validates: Requirements 4.3, 4.4, 4.5, 4.6, 4.7**

- [x] 5. 实现订阅服务模块
  - [x] 5.1 创建 lib/subscription-service.ts
    - 实现 getUserSubscription 函数
    - 实现 createSubscription 函数
    - 实现 updateSubscription 函数
    - 实现 addCreditsToUser 函数
    - 实现 canUpgrade 函数
    - _Requirements: 5.1, 5.3, 4.4_

  - [ ]* 5.2 编写升级可用性属性测试
    - **Property 7: Upgrade Availability Logic**
    - **Validates: Requirements 5.3**

- [x] 6. Checkpoint - 核心模块测试
  - 确保所有属性测试通过
  - 如有问题请询问用户

- [x] 7. 创建数据库 Schema
  - [x] 7.1 创建 Supabase subscriptions 表迁移
    - 创建 subscriptions 表
    - 添加 RLS 策略
    - 添加 profiles.credits 列（如不存在）
    - _Requirements: 4.3, 5.1_

- [x] 8. 实现 API 路由
  - [x] 8.1 创建 app/api/checkout/create/route.ts
    - 验证用户认证状态
    - 创建 Creem checkout session
    - 返回 checkout URL
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 8.2 创建 app/api/webhooks/creem/route.ts
    - 验证 webhook 签名
    - 路由到对应的事件处理器
    - 返回 HTTP 200
    - _Requirements: 4.1, 4.2, 4.7_

  - [x] 8.3 创建 app/api/subscription/status/route.ts
    - 获取当前用户订阅状态
    - 返回订阅信息或 null
    - _Requirements: 5.1_

- [x] 9. 更新前端组件
  - [x] 9.1 更新 components/pricing-card.tsx
    - 添加 onSubscribe 回调属性
    - 添加 currentPlan 属性显示当前计划
    - 添加 loading 状态
    - _Requirements: 5.2, 3.1_

  - [ ]* 9.2 编写定价卡片渲染属性测试
    - **Property 2: Pricing Card Rendering Completeness**
    - **Validates: Requirements 1.2**

  - [x] 9.3 更新 app/pricing/page.tsx
    - 集成用户认证状态检查
    - 实现订阅按钮点击处理
    - 获取并显示用户当前订阅状态
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 5.1, 5.2_

- [x] 10. 创建结账结果页面
  - [x] 10.1 创建 app/pricing/success/page.tsx
    - 显示支付成功信息
    - 提供返回首页或开始使用的链接
    - _Requirements: 3.5_

  - [x] 10.2 创建 app/pricing/cancel/page.tsx
    - 显示支付取消/失败信息
    - 提供重试或返回定价页的链接
    - _Requirements: 3.6_

- [x] 11. 实现错误处理
  - [x] 11.1 添加 API 错误处理
    - 创建统一的错误响应格式
    - 添加错误日志记录
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 11.2 添加前端错误提示
    - 使用 toast 显示错误消息
    - 处理网络错误和 API 错误
    - _Requirements: 7.1_

- [x] 12. Final Checkpoint - 集成测试
  - 确保所有测试通过
  - 验证完整的结账流程
  - 如有问题请询问用户

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以便追溯
- Checkpoint 任务用于验证阶段性成果
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
