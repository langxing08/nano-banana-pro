import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, images } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的提示词' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key 未配置' },
        { status: 500 }
      )
    }

    // 构建消息内容
    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: 'text',
        text: prompt,
      },
    ]

    // 添加图片（如果有）- 使用 base64 格式
    if (images && Array.isArray(images) && images.length > 0) {
      for (const imageData of images) {
        content.push({
          type: 'image_url',
          image_url: {
            url: imageData, // base64 data URL
          },
        })
      }
    }

    // 调用 OpenRouter API - 使用 Gemini 2.5 Flash Image 模型
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nano-banana.com',
        'X-Title': 'Nano Banana Image Editor',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: errorData.error?.message || 'API 调用失败' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('=== API Response Start ===')
    console.log('Full response:', JSON.stringify(data, null, 2))
    console.log('=== API Response End ===')
    
    const message = data.choices?.[0]?.message
    console.log('Message object:', JSON.stringify(message, null, 2))

    if (!message) {
      return NextResponse.json(
        { error: '未能生成内容' },
        { status: 500 }
      )
    }

    // 检查是否有生成的图片
    let generatedImageUrl: string | null = null
    let textContent: string = ''

    // 辅助函数：验证并清理 base64 数据
    const processBase64Image = (mimeType: string, base64Data: string): string | null => {
      if (!base64Data || typeof base64Data !== 'string') {
        console.log('Invalid base64 data:', typeof base64Data)
        return null
      }
      
      // 清理 base64 数据（移除换行符、空格等）
      const cleanBase64 = base64Data.replace(/[\s\n\r]/g, '')
      
      // 如果数据已经是 data URL 格式，直接返回
      if (cleanBase64.startsWith('data:')) {
        console.log('Already a data URL, length:', cleanBase64.length)
        return cleanBase64
      }
      
      console.log('Base64 image processed, mime:', mimeType, 'length:', cleanBase64.length)
      return `data:${mimeType};base64,${cleanBase64}`
    }

    // 递归搜索对象中的图片数据
    const findImageInObject = (obj: Record<string, unknown>, depth = 0): string | null => {
      if (depth > 5 || !obj || typeof obj !== 'object') return null
      
      // 检查常见的图片字段名
      const imageFields = ['data', 'image', 'image_data', 'b64_json', 'base64', 'url', 'content']
      const mimeFields = ['mime_type', 'mimeType', 'type', 'media_type']
      
      let mimeType = 'image/png'
      for (const field of mimeFields) {
        if (obj[field] && typeof obj[field] === 'string' && (obj[field] as string).includes('image')) {
          mimeType = obj[field] as string
          break
        }
      }
      
      for (const field of imageFields) {
        if (obj[field] && typeof obj[field] === 'string') {
          const value = obj[field] as string
          // 检查是否是 base64 数据（长度较长且包含 base64 字符）
          if (value.length > 100 && /^[A-Za-z0-9+/=\s]+$/.test(value.substring(0, 100))) {
            console.log(`Found potential base64 in field "${field}", length:`, value.length)
            return processBase64Image(mimeType, value)
          }
          // 检查是否是 data URL
          if (value.startsWith('data:image')) {
            console.log(`Found data URL in field "${field}"`)
            return value
          }
          // 检查是否是图片 URL
          if (value.startsWith('http') && /\.(png|jpg|jpeg|gif|webp)/i.test(value)) {
            console.log(`Found image URL in field "${field}"`)
            return value
          }
        }
      }
      
      // 递归搜索嵌套对象
      for (const key of Object.keys(obj)) {
        if (obj[key] && typeof obj[key] === 'object') {
          const result = findImageInObject(obj[key] as Record<string, unknown>, depth + 1)
          if (result) return result
        }
      }
      
      return null
    }

    // 处理返回内容 - 可能是字符串或数组
    if (typeof message.content === 'string') {
      textContent = message.content
      // 检查字符串内容是否包含 base64 图片
      if (message.content.length > 1000 && /^[A-Za-z0-9+/=\s]+$/.test(message.content.substring(0, 100))) {
        console.log('Content appears to be base64 image data')
        generatedImageUrl = processBase64Image('image/png', message.content)
      }
    } else if (Array.isArray(message.content)) {
      for (const part of message.content) {
        console.log('Processing part:', JSON.stringify(part).substring(0, 200))
        console.log('Part type:', part.type, 'keys:', Object.keys(part))
        
        // 格式 1: type: "inline_data" with inline_data object
        if (part.type === 'inline_data' && part.inline_data) {
          const mimeType = part.inline_data.mime_type || 'image/png'
          const result = processBase64Image(mimeType, part.inline_data.data)
          if (result) generatedImageUrl = result
        }
        // 格式 2: 直接包含 inline_data 字段（无 type）
        else if (part.inline_data) {
          const mimeType = part.inline_data.mime_type || 'image/png'
          const result = processBase64Image(mimeType, part.inline_data.data)
          if (result) generatedImageUrl = result
        }
        // 格式 3: type: "image" with data
        else if (part.type === 'image' && part.data) {
          const mimeType = part.mime_type || 'image/png'
          const result = processBase64Image(mimeType, part.data)
          if (result) generatedImageUrl = result
        }
        // 格式 4: type: "image_url" with url
        else if (part.type === 'image_url' && part.image_url?.url) {
          generatedImageUrl = part.image_url.url
          console.log('Found image_url format')
        }
        // 格式 5: 文本内容
        else if (part.type === 'text' && part.text) {
          textContent = part.text
        }
        else if (part.text && !part.type) {
          textContent = part.text
        }
        // 格式 6: 尝试递归搜索
        else if (!generatedImageUrl && typeof part === 'object') {
          const found = findImageInObject(part as Record<string, unknown>)
          if (found) {
            generatedImageUrl = found
            console.log('Found image via recursive search')
          }
        }
      }
    }
    
    // 如果还没找到，尝试在整个 message 对象中搜索
    if (!generatedImageUrl && message && typeof message === 'object') {
      console.log('Attempting recursive search in entire message object')
      const found = findImageInObject(message as Record<string, unknown>)
      if (found) {
        generatedImageUrl = found
        console.log('Found image in message object via recursive search')
      }
    }

    console.log('=== Final Result ===')
    console.log('Generated image URL found:', !!generatedImageUrl)
    console.log('Generated image URL preview:', generatedImageUrl?.substring(0, 100))
    console.log('Text content:', textContent)

    return NextResponse.json({
      success: true,
      content: textContent,
      imageUrl: generatedImageUrl,
      model: data.model,
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
