# Requirements Document

## Introduction

本功能实现一个完整的定价页面和 Creem 支付集成系统。定价页面参考 nanobanana.ai/pricing 的设计，提供 Basic、Pro、Max 三个订阅层级，支持月付/年付切换。通过 Creem 支付平台处理订阅支付，包括创建结账会话、处理 Webhook 回调、管理用户订阅状态。

## Glossary

- **Creem**: 一个面向开发者的支付平台，提供订阅管理、结账会话、Webhook 等功能
- **Checkout_Session**: Creem 创建的结账会话，包含支付链接供用户完成支付
- **Webhook**: Creem 发送的实时通知，用于同步支付和订阅状态
- **Subscription**: 用户的订阅记录，包含状态、计划、到期时间等信息
- **Credits**: 用户账户中的积分，用于消费 AI 图像生成服务
- **Billing_Period**: 计费周期，支持月付 (monthly) 和年付 (yearly)
- **Product**: Creem 中的产品对象，对应定价层级

## Requirements

### Requirement 1: 定价页面展示

**User Story:** As a visitor, I want to view pricing plans clearly, so that I can choose the right subscription for my needs.

#### Acceptance Criteria

1. WHEN a user visits the pricing page, THE Pricing_Page SHALL display three pricing tiers: Basic, Pro, and Max
2. WHEN displaying pricing tiers, THE Pricing_Page SHALL show the plan name, monthly price, credits per month, and feature list for each tier
3. THE Pricing_Page SHALL mark the Pro tier as "Most Popular" with visual distinction
4. WHEN the user toggles billing period, THE Pricing_Page SHALL update all displayed prices to reflect monthly or yearly billing
5. WHEN yearly billing is selected, THE Pricing_Page SHALL display the savings percentage compared to monthly billing
6. THE Pricing_Page SHALL display a FAQ section answering common pricing questions

### Requirement 2: 计费周期切换

**User Story:** As a user, I want to switch between monthly and yearly billing, so that I can see the pricing options that fit my budget.

#### Acceptance Criteria

1. THE Billing_Toggle SHALL default to monthly billing when the page loads
2. WHEN the user clicks the billing toggle, THE Pricing_Page SHALL switch between monthly and yearly pricing display
3. WHEN yearly billing is active, THE Pricing_Page SHALL show a "Save X%" badge indicating the discount
4. WHEN yearly billing is selected, THE Pricing_Page SHALL display the total yearly cost below the monthly equivalent price

### Requirement 3: Creem 结账流程

**User Story:** As a user, I want to subscribe to a plan, so that I can access premium features and credits.

#### Acceptance Criteria

1. WHEN a user clicks a subscription button, THE System SHALL check if the user is authenticated
2. IF the user is not authenticated, THEN THE System SHALL redirect to the login page with a return URL
3. WHEN an authenticated user clicks subscribe, THE Checkout_API SHALL create a Creem checkout session with the selected product and billing period
4. WHEN the checkout session is created successfully, THE System SHALL redirect the user to the Creem checkout URL
5. WHEN the checkout is completed, THE System SHALL redirect the user to a success page
6. IF the checkout fails or is canceled, THEN THE System SHALL redirect the user to a failure page with an appropriate message

### Requirement 4: Creem Webhook 处理

**User Story:** As a system administrator, I want to receive payment notifications, so that user subscriptions are automatically updated.

#### Acceptance Criteria

1. WHEN a webhook request is received, THE Webhook_Handler SHALL verify the Creem signature using HMAC-SHA256
2. IF the signature verification fails, THEN THE Webhook_Handler SHALL return HTTP 400 and log the error
3. WHEN a checkout.completed event is received, THE Webhook_Handler SHALL create or update the user's subscription record
4. WHEN a subscription.paid event is received, THE Webhook_Handler SHALL extend the subscription period and add credits to the user's account
5. WHEN a subscription.canceled event is received, THE Webhook_Handler SHALL mark the subscription as canceled
6. WHEN a subscription.expired event is received, THE Webhook_Handler SHALL mark the subscription as expired and revoke premium access
7. THE Webhook_Handler SHALL return HTTP 200 for all successfully processed events

### Requirement 5: 用户订阅状态管理

**User Story:** As a subscribed user, I want to see my subscription status, so that I know my current plan and remaining credits.

#### Acceptance Criteria

1. WHEN a subscribed user visits the pricing page, THE Pricing_Page SHALL indicate their current active plan
2. WHEN displaying the user's current plan, THE Pricing_Page SHALL show "Current Plan" instead of the subscribe button
3. WHEN a user has an active subscription, THE System SHALL allow upgrading to a higher tier
4. WHEN a user upgrades, THE Checkout_API SHALL create a checkout session for the upgrade with prorated pricing

### Requirement 6: Creem 产品配置

**User Story:** As a developer, I want to configure Creem products, so that the pricing tiers map correctly to Creem's payment system.

#### Acceptance Criteria

1. THE System SHALL store Creem product IDs for each pricing tier and billing period combination
2. THE System SHALL use environment variables to store Creem API keys and webhook secrets
3. WHEN creating a checkout session, THE Checkout_API SHALL include the user ID in metadata for webhook processing
4. THE System SHALL support both test mode and production mode for Creem integration

### Requirement 7: 错误处理

**User Story:** As a user, I want clear error messages when payment fails, so that I can understand what went wrong and try again.

#### Acceptance Criteria

1. IF the Creem API returns an error, THEN THE System SHALL display a user-friendly error message
2. IF the checkout session creation fails, THEN THE System SHALL log the error details for debugging
3. WHEN a webhook processing error occurs, THE Webhook_Handler SHALL log the error but still return HTTP 200 to prevent retries for invalid events
4. IF the user's session expires during checkout, THEN THE System SHALL redirect to login with the original intent preserved
