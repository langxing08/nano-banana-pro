'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useClipboard } from '@/hooks/use-clipboard'
import { toast } from 'sonner'

type Language = 'javascript' | 'python' | 'curl'

interface CodeExample {
  language: Language
  label: string
  code: string
}

interface ApiCodeBlockProps {
  examples: CodeExample[]
  className?: string
}

/**
 * ApiCodeBlock 组件 - API 代码示例
 * Requirements: 4.2
 */
export function ApiCodeBlock({ examples, className }: ApiCodeBlockProps) {
  const [activeLanguage, setActiveLanguage] = useState<Language>(examples[0]?.language || 'javascript')
  const { copied, copyToClipboard } = useClipboard()

  const activeExample = examples.find(e => e.language === activeLanguage)

  const handleCopy = async () => {
    if (activeExample) {
      const success = await copyToClipboard(activeExample.code)
      if (success) {
        toast.success('代码已复制到剪贴板')
      } else {
        toast.error('复制失败')
      }
    }
  }

  return (
    <div className={cn('rounded-lg overflow-hidden border border-border', className)}>
      {/* 语言切换标签 */}
      <div className="flex items-center justify-between bg-muted/50 border-b border-border px-4">
        <div className="flex">
          {examples.map((example) => (
            <button
              key={example.language}
              onClick={() => setActiveLanguage(example.language)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeLanguage === example.language
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {example.label}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* 代码内容 */}
      <div className="bg-gray-950 p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono whitespace-pre">
          {activeExample?.code}
        </pre>
      </div>
    </div>
  )
}

// 预定义的 API 示例
export const generateImageExamples: CodeExample[] = [
  {
    language: 'javascript',
    label: 'JavaScript',
    code: `const response = await fetch('https://api.nanobanana.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A futuristic city at sunset',
    model: 'nano-banana',
    size: '1024x1024',
    n: 1,
  }),
});

const data = await response.json();
console.log(data.images[0].url);`,
  },
  {
    language: 'python',
    label: 'Python',
    code: `import requests

response = requests.post(
    'https://api.nanobanana.ai/v1/generate',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'prompt': 'A futuristic city at sunset',
        'model': 'nano-banana',
        'size': '1024x1024',
        'n': 1,
    }
)

data = response.json()
print(data['images'][0]['url'])`,
  },
  {
    language: 'curl',
    label: 'cURL',
    code: `curl -X POST https://api.nanobanana.ai/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A futuristic city at sunset",
    "model": "nano-banana",
    "size": "1024x1024",
    "n": 1
  }'`,
  },
]
