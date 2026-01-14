/**
 * API 错误处理模块
 * Requirements: 7.1, 7.2, 7.3
 */

export interface ApiError {
  error: string
  code: string
  details?: string
}

/**
 * 错误代码常量
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_PRODUCT: 'INVALID_PRODUCT',
  CHECKOUT_FAILED: 'CHECKOUT_FAILED',
  WEBHOOK_INVALID_SIGNATURE: 'WEBHOOK_INVALID_SIGNATURE',
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

/**
 * 错误消息映射（用户友好的消息）
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.UNAUTHORIZED]: 'Please sign in to continue',
  [ERROR_CODES.INVALID_PRODUCT]: 'Invalid product selected',
  [ERROR_CODES.CHECKOUT_FAILED]: 'Failed to create checkout session. Please try again.',
  [ERROR_CODES.WEBHOOK_INVALID_SIGNATURE]: 'Invalid webhook signature',
  [ERROR_CODES.SUBSCRIPTION_NOT_FOUND]: 'Subscription not found',
  [ERROR_CODES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again later.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid request data',
}

/**
 * 创建 API 错误响应
 */
export function createApiError(
  code: ErrorCode,
  details?: string
): ApiError {
  return {
    error: ERROR_MESSAGES[code],
    code,
    details,
  }
}

/**
 * 记录错误日志
 */
export function logError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`[${context}] Error:`, {
    message: errorMessage,
    stack: errorStack,
    ...additionalInfo,
    timestamp: new Date().toISOString(),
  })
}

/**
 * 安全地获取错误消息
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}
