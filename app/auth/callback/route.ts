import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * OAuth 回调处理
 * 处理 Google OAuth 授权码交换
 * Requirements: 2.3, 2.4, 2.5
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 成功交换授权码，重定向到目标页面
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 授权码交换失败，重定向到错误页面
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
