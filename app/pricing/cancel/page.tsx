'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

/**
 * 支付取消/失败页面
 * Requirements: 3.6
 */
export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-lg">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                Payment Canceled
              </h1>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Your payment was canceled or could not be completed. Don&apos;t worry, no charges were made to your account.
              </p>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  If you experienced any issues during checkout, please try again or contact our support team for assistance.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/pricing">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Need help? Contact us at{' '}
                  <a href="mailto:support@nanobanana.ai" className="text-primary hover:underline">
                    support@nanobanana.ai
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
