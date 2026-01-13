import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 认证错误页面
 * 当 OAuth 授权码交换失败时显示
 * Requirements: 2.5, 7.1
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">🍌</span>
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was an error during the authentication process. This could be due to an expired or invalid authorization code.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#f59e0b] hover:bg-[#d97706]">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/?login=retry">Try Again</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
