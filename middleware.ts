import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 受保护的路由模式
 * 未认证用户访问这些路由将被重定向到登录页
 * Requirements: 6.4
 */
const protectedRoutes = ['/generator', '/dashboard']

/**
 * 认证中间件
 * 负责刷新过期的 Auth token 并管理 cookies
 * Requirements: 1.4, 1.5, 6.1, 6.2, 6.3
 */
export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 如果 Supabase 未配置，跳过认证检查
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // 重要：不要在 createServerClient 和 supabase.auth.getUser() 之间
  // 编写任何逻辑。一个简单的错误可能会导致用户被随机登出。
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 如果 token 刷新失败，清除 session 并重定向到首页 (Requirements: 7.3)
  if (error && error.message.includes('refresh_token')) {
    // 清除所有 Supabase cookies
    const response = NextResponse.redirect(new URL('/', request.url))
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.delete(cookie.name)
      }
    })
    return response
  }

  // 检查是否访问受保护路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // 未认证用户访问受保护路由时重定向到首页
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('login', 'required')
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // 重要：必须返回 supabaseResponse 对象
  // 如果创建新的 response 对象，确保：
  // 1. 传递 request: NextResponse.next({ request })
  // 2. 复制 cookies: supabaseResponse.cookies.getAll().forEach(...)
  // 3. 根据需要修改 response
  // 4. 返回修改后的 response
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon 文件)
     * - 图片文件 (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
