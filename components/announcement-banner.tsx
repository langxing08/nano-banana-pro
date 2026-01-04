'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnnouncementBannerProps {
  message: string
  linkText: string
  linkHref: string
  onDismiss?: () => void
  className?: string
  storageKey?: string
}

/**
 * AnnouncementBanner 组件 - 显示公告横幅
 * Requirements: 12.1, 12.2, 12.3
 */
export function AnnouncementBanner({
  message,
  linkText,
  linkHref,
  onDismiss,
  className,
  storageKey = 'announcement-dismissed',
}: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true) // 默认隐藏，等待客户端检查

  useEffect(() => {
    // 检查 sessionStorage 中是否已关闭
    const dismissed = sessionStorage.getItem(storageKey)
    setIsDismissed(dismissed === 'true')
  }, [storageKey])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem(storageKey, 'true')
    onDismiss?.()
  }

  if (isDismissed) {
    return null
  }

  return (
    <div
      className={cn(
        'bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative',
        className
      )}
    >
      <div className="container flex items-center justify-center gap-2">
        <span className="font-medium">{message}</span>
        <a
          href={linkHref}
          className="underline underline-offset-2 hover:no-underline font-semibold"
        >
          {linkText}
        </a>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded transition-colors"
        aria-label="关闭公告"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
