'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface NavLink {
  label: string
  href: string
  isDropdown?: boolean
  children?: NavLink[]
}

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
}

/**
 * MobileNav 组件 - 移动端导航抽屉
 * Requirements: 6.2, 6.3, 6.4
 */
export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const handleLinkClick = (href: string) => {
    // 如果是锚点链接，执行平滑滚动
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        // 更新 URL hash
        window.history.pushState(null, '', href)
      }
    }
    // 点击链接后关闭抽屉
    onClose()
  }

  const renderLink = (link: NavLink, index: number) => {
    if (link.isDropdown && link.children) {
      return (
        <div key={index} className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground px-3">
            {link.label}
          </span>
          <div className="space-y-1 pl-3">
            {link.children.map((child, childIndex) => (
              <a
                key={childIndex}
                href={child.href}
                onClick={(e) => {
                  if (child.href.startsWith('#')) {
                    e.preventDefault()
                  }
                  handleLinkClick(child.href)
                }}
                className={cn(
                  'block px-3 py-2 text-base font-medium rounded-lg',
                  'text-foreground hover:bg-accent hover:text-accent-foreground',
                  'transition-colors'
                )}
              >
                {child.label}
              </a>
            ))}
          </div>
        </div>
      )
    }

    return (
      <a
        key={index}
        href={link.href}
        onClick={(e) => {
          if (link.href.startsWith('#')) {
            e.preventDefault()
          }
          handleLinkClick(link.href)
        }}
        className={cn(
          'block px-3 py-3 text-base font-medium rounded-lg',
          'text-foreground hover:bg-accent hover:text-accent-foreground',
          'transition-colors'
        )}
      >
        {link.label}
      </a>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">🍌</span>
            <span className="font-bold">Nano Banana</span>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-1 p-4">
          {links.map((link, index) => renderLink(link, index))}
        </nav>

        {/* 底部操作按钮 */}
        <div className="mt-auto border-t p-4 space-y-3">
          <a
            href="/pricing"
            onClick={() => onClose()}
            className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/api-docs"
            onClick={() => onClose()}
            className="block w-full text-center px-4 py-2 border border-input rounded-lg font-medium hover:bg-accent transition-colors"
          >
            API Docs
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
