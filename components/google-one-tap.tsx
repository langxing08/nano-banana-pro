'use client'

import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Google One-Tap 类型定义
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleOneTapConfig) => void
          prompt: () => void
          cancel: () => void
        }
      }
    }
  }
}

interface GoogleOneTapConfig {
  client_id: string
  callback: (response: CredentialResponse) => void
  nonce: string
  use_fedcm_for_prompt: boolean
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

interface CredentialResponse {
  credential: string
  select_by?: string
}

/**
 * 生成 nonce 用于安全验证
 * 返回 [原始 nonce, 哈希后的 nonce]
 * Requirements: 3.5
 */
const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  )
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return [nonce, hashedNonce]
}

/**
 * Google One-Tap 登录组件
 * 在用户未登录时显示 Google 一键登录提示
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
export function GoogleOneTap() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  // 检查是否已有会话 (Requirements: 3.1, 3.2)
  useEffect(() => {
    const checkSession = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

      // 检查配置
      if (
        !supabaseUrl ||
        !supabaseAnonKey ||
        !googleClientId ||
        supabaseUrl === 'your-supabase-url'
      ) {
        setIsConfigured(false)
        setHasSession(true) // 设为 true 以阻止渲染
        return
      }

      setIsConfigured(true)

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
    }
    checkSession()
  }, [])

  // 初始化 Google One-Tap
  const initializeGoogleOneTap = async () => {
    // 如果已有会话或未配置，不显示 One-Tap (Requirements: 3.2)
    if (hasSession || !isConfigured) return

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId || clientId === 'your-google-client-id') {
      console.warn('Google Client ID not configured')
      return
    }

    // 延迟 1 秒再显示 One-Tap，避免与页面加载冲突
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 再次检查会话状态（可能在延迟期间已登录）
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      return
    }

    try {
      const [nonce, hashedNonce] = await generateNonce()

      // 初始化 Google One-Tap (Requirements: 3.3, 3.4, 3.5)
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: CredentialResponse) => {
          try {
            // 使用 signInWithIdToken 创建会话 (Requirements: 3.3)
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            })

            if (error) {
              console.error('One-Tap sign in error:', error)
              toast.error('Failed to sign in. Please try again.')
              return
            }

            toast.success('Signed in successfully!')
            router.push('/')
            router.refresh()
          } catch (err) {
            console.error('One-Tap callback error:', err)
            toast.error('An unexpected error occurred.')
          }
        },
        nonce: hashedNonce,
        // 使用 FedCM 以兼容 Chrome 第三方 cookie 淘汰 (Requirements: 3.4)
        use_fedcm_for_prompt: true,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // 显示 One-Tap 提示 (Requirements: 3.1)
      // 使用 try-catch 捕获 FedCM AbortError（用户关闭提示时的正常行为）
      try {
        window.google?.accounts.id.prompt()
      } catch {
        // 忽略 FedCM 中止错误
      }
    } catch (err) {
      console.error('Failed to initialize Google One-Tap:', err)
    }
  }

  // 如果会话状态未确定、已有会话或未配置，不渲染任何内容
  if (hasSession === null || hasSession || !isConfigured) {
    return null
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      onReady={() => {
        initializeGoogleOneTap()
      }}
      strategy="lazyOnload"
    />
  )
}
