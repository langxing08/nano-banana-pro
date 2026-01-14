'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { createBrowserClient } from '@supabase/ssr'

/**
 * 支付成功页面
 * Requirements: 3.5
 */
export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 刷新会话状态 - 从 Creem 支付页面返回后可能需要重新验证
    const refreshSession = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // 尝试刷新会话
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Failed to refresh session:', error)
      }
      
      // 如果有会话，尝试刷新 token
      if (session) {
        await supabase.auth.refreshSession()
      }
    }
    
    refreshSession()
    
    // 触发庆祝动画
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-lg">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                Payment Successful! 🎉
              </h1>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Thank you for subscribing to Nano Banana! Your account has been upgraded and your credits have been added.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Your credits are ready to use!</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/generator">
                    Start Creating
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your registered email address.
                <br />
                If you have any questions, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
