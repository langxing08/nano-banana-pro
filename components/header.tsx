'use client'

import { useState } from 'react'
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sun, Moon, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { MobileNav, type NavLink } from "@/components/mobile-nav"

// 导航链接配置
const navLinks: NavLink[] = [
  { label: 'Image Editor', href: '#editor' },
  { label: 'Showcase', href: '#showcase' },
  {
    label: 'Toolbox',
    href: '#',
    isDropdown: true,
    children: [
      { label: 'Image Resizer', href: '/tools/resizer' },
      { label: 'Background Remover', href: '/tools/bg-remover' },
      { label: 'Image Compressor', href: '/tools/compressor' },
      { label: 'Format Converter', href: '/tools/converter' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'API', href: '/api-docs' },
]

/**
 * Header 组件 - 网站头部导航
 * Requirements: 6.1, 7.1, 11.1, 11.3, 12.1, 12.2, 12.3
 */
export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // 平滑滚动到锚点
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        // 更新 URL hash
        window.history.pushState(null, '', href)
      }
    }
  }

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      {/* 公告横幅 */}
      <AnnouncementBanner
        message="NEW: Nano Banana Pro is now live"
        linkText="Try it now"
        linkHref="/pricing"
        storageKey="nano-banana-pro-announcement"
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍌</span>
            <span className="text-xl font-bold text-[#f59e0b]">Nano Banana</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="#editor" 
              onClick={(e) => handleSmoothScroll(e, '#editor')}
              className="text-sm font-medium hover:text-foreground/80 transition-colors"
            >
              Image Editor
            </Link>
            <Link 
              href="#showcase" 
              onClick={(e) => handleSmoothScroll(e, '#showcase')}
              className="text-sm font-medium hover:text-foreground/80 transition-colors"
            >
              Showcase
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-foreground/80 transition-colors">
                Toolbox
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Image Resizer</DropdownMenuItem>
                <DropdownMenuItem>Background Remover</DropdownMenuItem>
                <DropdownMenuItem>Image Compressor</DropdownMenuItem>
                <DropdownMenuItem>Format Converter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/pricing" className="text-sm font-medium hover:text-foreground/80 transition-colors">
              Pricing
            </Link>
            <Link href="/api-docs" className="text-sm font-medium hover:text-foreground/80 transition-colors">
              API
            </Link>
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* 主题切换按钮 */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* 语言选择 */}
            <button className="hidden sm:flex items-center gap-1 p-2 hover:bg-accent rounded-lg transition-colors">
              <span className="text-xl">🇺🇸</span>
            </button>

            {/* 桌面端按钮 */}
            <Button className="hidden sm:inline-flex bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium">
              Launch Now
            </Button>

            <Button
              variant="outline"
              className="hidden sm:inline-flex border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white font-medium bg-transparent"
            >
              Sign In
            </Button>

            {/* 移动端汉堡菜单按钮 */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="打开菜单"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端导航抽屉 */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navLinks}
      />
    </>
  )
}
