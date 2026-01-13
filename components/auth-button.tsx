'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Google One-Tap 类型声明
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          cancel: () => void
        }
      }
    }
  }
}

/**
 * 认证按钮组件
 * 根据用户认证状态显示登录按钮或用户信息
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      // 检查 Supabase 是否配置
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
        setIsConfigured(false)
        setLoading(false)
        return
      }

      setIsConfigured(true)

      // 动态导入 Supabase 客户端
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      // 使用 getSession 而不是 getUser 来避免 AuthSessionMissingError
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      // 监听认证状态变化 (Requirements: 5.5)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
        }
      )

      return () => subscription.unsubscribe()
    }

    initAuth()
  }, [])

  // Google OAuth 登录
  const handleSignIn = async () => {
    try {
      // 取消 Google One-Tap 以避免冲突
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error('Failed to sign in. Please try again.')
        console.error('Sign in error:', error)
      }
    } catch (err) {
      toast.error('An unexpected error occurred.')
      console.error('Sign in error:', err)
    }
  }

  // 登出
  const handleSignOut = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Failed to sign out. Please try again.')
        console.error('Sign out error:', error)
      } else {
        toast.success('Signed out successfully')
        window.location.reload()
      }
    } catch (err) {
      toast.error('An unexpected error occurred.')
      console.error('Sign out error:', err)
    }
  }

  // 加载状态 (Requirements: 5.4)
  if (loading) {
    return (
      <Button variant="outline" disabled className="min-w-[100px]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  // Supabase 未配置时显示禁用的按钮
  if (!isConfigured) {
    return (
      <Button
        variant="outline"
        disabled
        className="border-[#f59e0b] text-[#f59e0b] font-medium bg-transparent opacity-50"
        title="Please configure Supabase to enable authentication"
      >
        Sign In
      </Button>
    )
  }

  // 已登录状态 (Requirements: 5.2)
  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url
    const fullName = user.user_metadata?.full_name || user.email
    const initials = fullName?.[0]?.toUpperCase() || 'U'

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} alt={fullName || 'User avatar'} />
              <AvatarFallback className="bg-[#f59e0b] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={fullName || 'User avatar'} />
              <AvatarFallback className="bg-[#f59e0b] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 未登录状态 (Requirements: 5.1)
  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white font-medium bg-transparent"
    >
      Sign In
    </Button>
  )
}
