'use client'

import React from 'react'
import { ImageIcon, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  createdAt: Date
}

export interface OutputGalleryProps {
  images: GeneratedImage[]
  isLoading: boolean
  onDownload: (image: GeneratedImage) => void
  className?: string
}

/**
 * OutputGallery 组件 - 显示生成的图片
 * Requirements: 2.1, 2.2, 2.3, 2.5
 */
export function OutputGallery({
  images,
  isLoading,
  onDownload,
  className,
}: OutputGalleryProps) {
  // 空状态
  if (!isLoading && images.length === 0) {
    return (
      <div className={cn('bg-white border border-gray-200 rounded-xl p-12 min-h-[400px] flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <p className="font-medium text-foreground mb-2">准备好即时生成</p>
          <p className="text-sm text-muted-foreground">输入提示词，释放 AI 的力量</p>
        </div>
      </div>
    )
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn('bg-white border border-gray-200 rounded-xl p-12 min-h-[400px] flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-lg flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <p className="font-medium text-foreground mb-2">正在生成中...</p>
          <p className="text-sm text-muted-foreground">AI 正在处理您的图片，请稍候</p>
        </div>
      </div>
    )
  }

  // 显示生成的图片
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="aspect-square">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image load error for:', image.id)
                  // 设置一个占位图
                  e.currentTarget.src = '/placeholder.svg'
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', image.id)
                }}
              />
            </div>
            
            {/* 悬停遮罩和下载按钮 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Button
                onClick={() => onDownload(image)}
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
            </div>

            {/* 提示词预览 */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs line-clamp-2">{image.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 图片数量指示 */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          已生成 {images.length} 张图片
        </p>
      )}
    </div>
  )
}
