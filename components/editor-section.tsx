"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Target, Sparkles, Crown, Library, Copy, X, Check } from "lucide-react"
import { ImageUpload, type UploadedImage } from "@/components/image-upload"
import { OutputGallery, type GeneratedImage } from "@/components/output-gallery"
import { useClipboard } from "@/hooks/use-clipboard"
import { toast } from "sonner"

export function EditorSection() {
  const imageToImagePrompt = "create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork."
  const textToImagePrompt = "A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
  
  const [prompt, setPrompt] = useState(imageToImagePrompt)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [activeTab, setActiveTab] = useState<"image" | "text">("image")
  const [isGenerating, setIsGenerating] = useState(false)
  const { copied, copyToClipboard } = useClipboard()

  // 处理图片上传
  const handleUpload = (files: UploadedImage[]) => {
    setUploadedImages(files)
  }

  // 处理上传错误
  const handleUploadError = (error: string) => {
    toast.error(error)
  }

  // 复制提示词
  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(prompt)
    if (success) {
      toast.success("提示词已复制到剪贴板")
    } else {
      toast.error("复制失败，请重试")
    }
  }

  // 调用 Gemini API 生成图片
  const handleGenerate = async () => {
    if (activeTab === "image" && uploadedImages.length === 0) {
      toast.error("请先上传至少一张图片")
      return
    }
    if (!prompt.trim()) {
      toast.error("请输入提示词")
      return
    }

    setIsGenerating(true)
    
    try {
      // 只在 image-to-image 模式下发送图片
      const imageDataUrls: string[] = []
      if (activeTab === "image") {
        for (const img of uploadedImages) {
          imageDataUrls.push(img.preview) // preview 已经是 base64 data URL
        }
      }

      // 构建请求体 - text-to-image 模式不发送 images 字段
      const requestBody: { prompt: string; images?: string[]; mode: string } = {
        prompt: prompt,
        mode: activeTab, // 传递当前模式
      }
      
      // 只有 image-to-image 模式才添加图片
      if (activeTab === "image" && imageDataUrls.length > 0) {
        requestBody.images = imageDataUrls
      }

      // 调用 API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      console.log('=== Frontend received data ===')
      console.log('Response data:', data)
      console.log('imageUrl exists:', !!data.imageUrl)
      console.log('imageUrl preview:', data.imageUrl?.substring(0, 100))

      if (!response.ok) {
        throw new Error(data.error || 'API 调用失败')
      }

      // 处理生成结果 - 只有当有图片时才添加到画廊
      if (data.imageUrl) {
        const newImage: GeneratedImage = {
          id: `gen-${Date.now()}`,
          url: data.imageUrl,
          prompt: prompt,
          createdAt: new Date(),
        }
        
        console.log('New image object:', { id: newImage.id, urlLength: newImage.url.length, urlPreview: newImage.url.substring(0, 100) })
        
        // 每次生成时只显示最新的图片，清除之前的缓存
        setGeneratedImages([newImage])
      } else if (data.content) {
        // 如果没有生成图片但有文本内容，显示文本
        toast.info(`AI 回复: ${data.content.substring(0, 100)}...`)
        return // 不添加到画廊
      } else {
        toast.error("未能生成图片，请重试")
        return
      }
      toast.success("生成完成！")
    } catch (error) {
      console.error('Generate error:', error)
      toast.error(error instanceof Error ? error.message : "生成失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  // 下载图片 - 支持 base64 data URL
  const handleDownload = async (image: GeneratedImage) => {
    try {
      let blob: Blob
      
      if (image.url.startsWith('data:')) {
        // 处理 base64 data URL
        const response = await fetch(image.url)
        blob = await response.blob()
      } else {
        // 处理普通 URL
        const response = await fetch(image.url)
        blob = await response.blob()
      }
      
      // 创建下载链接
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `nano-banana-${image.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理 blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
      
      toast.success("图片下载已开始")
    } catch (error) {
      console.error('Download error:', error)
      toast.error("下载失败，请重试")
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2">Get Started</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Try The AI Editor</h2>
          <p className="text-muted-foreground text-lg mb-2">
            Experience the power of nano-banana&apos;s natural language image editing.
          </p>
          <p className="text-muted-foreground">Transform any photo with simple text commands</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-primary text-white p-1.5 rounded">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg">Prompt Engine</h3>
              </div>
              <p className="text-sm text-muted-foreground">Transform your image with AI-powered editing</p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (activeTab !== "image") {
                    setActiveTab("image")
                    setGeneratedImages([]) // 切换模式时清空画廊
                    setPrompt(imageToImagePrompt) // 切换到 image-to-image 的默认提示词
                  }
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "image" ? "bg-primary text-white" : "bg-yellow-100 dark:bg-yellow-900/30 text-foreground hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Image to Image
              </button>
              <button
                onClick={() => {
                  if (activeTab !== "text") {
                    setActiveTab("text")
                    setGeneratedImages([]) // 切换模式时清空画廊
                    setPrompt(textToImagePrompt) // 切换到 text-to-image 的默认提示词
                  }
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "text" ? "bg-primary text-white" : "bg-yellow-100 dark:bg-yellow-900/30 text-foreground hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                }`}
              >
                <Target className="w-4 h-4" />
                Text to Image
              </button>
            </div>

            {/* AI Model Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">AI Model Selection</label>
              </div>
              <Select defaultValue="nano-banana">
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nano-banana">Nano Banana</SelectItem>
                  <SelectItem value="seedream-4">SeeDream 4</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Different models offer unique characteristics and styles</p>
            </div>

            {/* Batch Processing */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Batch Processing</span>
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PRO
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-auto p-0 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Enable batch mode to process multiple images at once</p>
            </div>

            {/* Reference Image - 使用 ImageUpload 组件 */}
            {activeTab === "image" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Reference Image</label>
                    <span className="text-sm text-muted-foreground">{uploadedImages.length}/9</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-auto p-0 text-xs">
                    <Library className="w-3 h-3 mr-1" />
                    Select from Library
                  </Button>
                </div>

                <ImageUpload
                  maxFiles={9}
                  onUpload={handleUpload}
                  onError={handleUploadError}
                />
              </div>
            )}

            {/* Main Prompt */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">Main Prompt</label>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24 resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
                onClick={handleCopyPrompt}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 relative">
              <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-muted-foreground mb-2 pr-6">Want more powerful image generation features?</p>
              <a href="/generator" className="text-sm text-primary font-medium hover:underline">
                Visit Full Generator →
              </a>
            </div>

            {/* Generate Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Now
                </>
              )}
            </Button>
          </div>

          {/* Output Gallery - 使用 OutputGallery 组件 */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-primary mb-1">Output Gallery</h3>
              <p className="text-sm text-muted-foreground">Your ultra-fast AI creations appear here instantly</p>
            </div>

            <OutputGallery
              images={generatedImages}
              isLoading={isGenerating}
              onDownload={handleDownload}
              className="min-h-[500px]"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-2">Want more powerful image generation features?</p>
          <a href="/generator" className="text-primary font-medium hover:underline">
            Visit Full Generator →
          </a>
        </div>
      </div>
    </section>
  )
}
