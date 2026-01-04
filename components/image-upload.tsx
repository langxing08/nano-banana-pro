'use client'

import React, { useCallback, useRef, useState } from 'react'
import { ImageIcon, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateFile, generatePreview } from '@/lib/image-utils'

export interface UploadedImage {
  id: string
  file: File
  preview: string
  name: string
  size: number
}

export interface ImageUploadProps {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  onUpload: (files: UploadedImage[]) => void
  onError: (error: string) => void
  className?: string
}

/**
 * ImageUpload component for handling image uploads with drag-and-drop support
 * Requirements: 1.1, 1.2, 1.5, 1.6, 1.7
 */
export function ImageUpload({
  maxFiles = 9,
  onUpload,
  onError,
  className,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remainingSlots = maxFiles - images.length
    
    if (fileArray.length > remainingSlots) {
      onError(`You can only upload ${remainingSlots} more image(s). Maximum is ${maxFiles}.`)
      return
    }

    const newImages: UploadedImage[] = []
    
    for (const file of fileArray) {
      const validation = validateFile(file)
      if (!validation.valid) {
        onError(validation.error || 'Invalid file')
        continue
      }

      try {
        const preview = await generatePreview(file)
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          name: file.name,
          size: file.size,
        })
      } catch {
        onError('Failed to generate preview.')
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onUpload(updatedImages)
    }
  }, [images, maxFiles, onUpload, onError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [processFiles])

  const handleRemove = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onUpload(updatedImages)
  }, [images, onUpload])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-yellow-300 bg-white hover:border-primary',
          images.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          disabled={images.length >= maxFiles}
        />
        
        {images.length === 0 ? (
          <div>
            <div className="text-primary text-4xl mb-2">+</div>
            <p className="text-sm font-medium mb-1">Add Image</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">Max 10MB per file</p>
          </div>
        ) : images.length < maxFiles ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-5 h-5" />
            <span className="text-sm">Add more images</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Maximum images reached</span>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <img
                src={image.preview}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(image.id)
                }}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label={`Remove ${image.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Count Indicator */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {images.length}/{maxFiles} images
        </p>
      )}
    </div>
  )
}
