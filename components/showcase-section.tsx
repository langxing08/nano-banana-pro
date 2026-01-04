'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShowcaseItem {
  title: string
  subtitle: string
  beforeImage: string
  afterImage: string
  prompt: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    title: "Ultra-Fast Mountain Generation",
    subtitle: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    prompt: "majestic mountain landscape at sunset with dramatic golden hour lighting on snow peaks",
  },
  {
    title: "Instant Garden Creation",
    subtitle: "Complex scene rendered in milliseconds using Nano Banana technology",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    prompt: "beautiful Japanese garden with cherry blossoms and koi pond",
  },
  {
    title: "Real-time Beach Synthesis",
    subtitle: "Nano Banana delivers photorealistic results at lightning speed",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    prompt: "tropical paradise beach with crystal clear water and palm trees",
  },
  {
    title: "Rapid Aurora Generation",
    subtitle: "Advanced effects processed instantly with Nano Banana AI",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    prompt: "vibrant northern lights aurora borealis over dark ocean",
  },
]

/**
 * ShowcaseSection 组件 - 案例展示
 * Requirements: 9.1, 9.2, 9.3
 */
export function ShowcaseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="showcase" className="py-20 bg-gradient-to-b from-white to-secondary/20 dark:from-background dark:to-secondary/10">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2">Showcase</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Lightning-Fast AI Creations</h2>
          <p className="text-muted-foreground mt-2">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {showcaseItems.map((item, index) => (
            <Card 
              key={index} 
              className={cn(
                "overflow-hidden border-primary/20 border-2 transition-all duration-300",
                "hover:shadow-xl hover:scale-[1.02] hover:border-primary/40"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 前后对比图片区域 */}
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-muted relative overflow-hidden">
                {/* Before 图片 */}
                <img
                  src={item.beforeImage}
                  alt={`${item.title} - Before`}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                    hoveredIndex === index ? "opacity-0" : "opacity-100"
                  )}
                />
                {/* After 图片 */}
                <img
                  src={item.afterImage}
                  alt={`${item.title} - After`}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                    hoveredIndex === index ? "opacity-100" : "opacity-0"
                  )}
                />
                
                {/* 速度标签 */}
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-0 shadow-lg">
                  ⚡ Nano Banana Speed
                </Badge>

                {/* 前后对比指示器 */}
                <div className={cn(
                  "absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                  hoveredIndex === index 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-800/70 text-white"
                )}>
                  {hoveredIndex === index ? "After" : "Before"}
                </div>

                {/* 悬停提示 */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300",
                  hoveredIndex === index ? "opacity-0" : "opacity-0 hover:opacity-100"
                )}>
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                    Hover to see result
                  </span>
                </div>
              </div>

              <CardContent className="p-6 bg-gradient-to-b from-amber-50/50 to-yellow-50/30 dark:from-amber-950/20 dark:to-yellow-950/10">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{item.subtitle}</p>
                <p className="text-xs text-muted-foreground/70 italic line-clamp-2">
                  Prompt: &quot;{item.prompt}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="/generator">Try Nano Banana Generator</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
