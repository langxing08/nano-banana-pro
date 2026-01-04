'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ImageUpload, type UploadedImage } from '@/components/image-upload'
import { OutputGallery, type GeneratedImage } from '@/components/output-gallery'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ImageIcon, Crown, Bell, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

// 生成提示和技巧
const tips = [
  'Be specific about lighting conditions (e.g., "golden hour", "soft diffused light")',
  'Include style references (e.g., "in the style of Studio Ghibli")',
  'Describe the mood or atmosphere you want',
  'Use negative prompts to exclude unwanted elements',
  'Higher resolution requires more credits but produces better details',
]

/**
 * 生成器页面
 * Requirements: 5.1-5.6
 */
export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('nano-banana')
  const [resolution, setResolution] = useState('standard')
  const [notifyOnComplete, setNotifyOnComplete] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUpload = (files: UploadedImage[]) => {
    setUploadedImages(files)
  }

  const handleUploadError = (error: string) => {
    toast.error(error)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    setIsGenerating(true)

    // 模拟生成延迟
    await new Promise(resolve => setTimeout(resolve, 2500))

    const newImage: GeneratedImage = {
      id: `gen-${Date.now()}`,
      url: '/placeholder.svg',
      prompt: prompt,
      createdAt: new Date(),
    }

    setGeneratedImages(prev => [newImage, ...prev])
    setIsGenerating(false)

    if (notifyOnComplete) {
      toast.success('图片生成完成！', {
        description: '您的 AI 创作已准备就绪',
      })
    } else {
      toast.success('图片生成成功！')
    }
  }

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `nano-banana-${image.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('图片下载已开始')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🍌 Full Generator
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Nano Banana Image Generator
            </h1>
            <p className="text-muted-foreground">
              Unleash your creativity with our most powerful AI image generation tools
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Model Selection */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Model
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nano-banana">
                          Nano Banana
                        </SelectItem>
                        <SelectItem value="seedream-4">
                          <span className="flex items-center gap-2">
                            SeeDream 4
                            <Badge variant="secondary" className="text-xs">PRO</Badge>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {model === 'nano-banana' 
                        ? 'Fast, versatile image generation' 
                        : 'Premium photorealistic quality'}
                    </p>
                  </div>

                  {/* Resolution */}
                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (1024×1024)</SelectItem>
                        <SelectItem value="2k">
                          <span className="flex items-center gap-2">
                            2K (2048×2048)
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              VIP
                            </Badge>
                          </span>
                        </SelectItem>
                        <SelectItem value="4k">
                          <span className="flex items-center gap-2">
                            4K (4096×4096)
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              VIP
                            </Badge>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notify Option */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      Notify when complete
                    </Label>
                    <Switch
                      id="notify"
                      checked={notifyOnComplete}
                      onCheckedChange={setNotifyOnComplete}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Reference Images */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Reference Images
                    <span className="text-muted-foreground text-xs">({uploadedImages.length}/9)</span>
                  </Label>
                  <ImageUpload
                    maxFiles={9}
                    onUpload={handleUpload}
                    onError={handleUploadError}
                  />
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-sm">Pro Tips</span>
                  </div>
                  <ul className="space-y-2">
                    {tips.map((tip, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-yellow-600">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Center Panel - Prompt & Generate */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Label>Prompt</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    2 credits per generation • {model === 'seedream-4' ? '4' : '2'} credits for {model}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Output */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-primary mb-1">Output Gallery</h3>
                    <p className="text-sm text-muted-foreground">Your AI creations appear here</p>
                  </div>
                  <OutputGallery
                    images={generatedImages}
                    isLoading={isGenerating}
                    onDownload={handleDownload}
                    className="min-h-[400px]"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
