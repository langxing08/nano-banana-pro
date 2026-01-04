import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  validateFileType,
  validateFileSize,
  validateFile,
  SUPPORTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from './image-utils'

/**
 * Feature: image-editor-clone
 * Property 1: 文件类型和大小验证
 * Validates: Requirements 1.1, 1.3, 1.4, 1.5
 */

// 创建模拟 File 对象的辅助函数
function createMockFile(type: string, size: number, name = 'test.jpg'): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('Image Utils - File Validation', () => {
  describe('validateFileType', () => {
    it('should accept valid image types (JPEG, PNG, WebP, GIF)', () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      
      validTypes.forEach(type => {
        const file = createMockFile(type, 1000)
        const result = validateFileType(file)
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    it('should reject invalid file types', () => {
      const invalidTypes = ['image/bmp', 'image/tiff', 'application/pdf', 'text/plain', 'video/mp4']
      
      invalidTypes.forEach(type => {
        const file = createMockFile(type, 1000)
        const result = validateFileType(file)
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Unsupported file type. Please upload JPEG, PNG, WebP, or GIF.')
      })
    })

    // Property-based test: 所有支持的类型都应该通过验证
    it('Property: all supported types should be valid', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_IMAGE_TYPES),
          (type) => {
            const file = createMockFile(type, 1000)
            const result = validateFileType(file)
            return result.valid === true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('validateFileSize', () => {
    it('should accept files within size limit (10MB)', () => {
      const validSizes = [1, 1000, 1024 * 1024, 5 * 1024 * 1024, MAX_FILE_SIZE]
      
      validSizes.forEach(size => {
        const file = createMockFile('image/jpeg', size)
        const result = validateFileSize(file)
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    it('should reject files exceeding size limit', () => {
      const file = createMockFile('image/jpeg', MAX_FILE_SIZE + 1)
      const result = validateFileSize(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('File size exceeds 10MB limit.')
    })

    // Property-based test: 所有小于等于 MAX_FILE_SIZE 的文件都应该通过
    it('Property: files within size limit should be valid', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: MAX_FILE_SIZE }),
          (size) => {
            const file = createMockFile('image/jpeg', size)
            const result = validateFileSize(file)
            return result.valid === true
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property-based test: 所有大于 MAX_FILE_SIZE 的文件都应该失败
    it('Property: files exceeding size limit should be invalid', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 2 }),
          (size) => {
            const file = createMockFile('image/jpeg', size)
            const result = validateFileSize(file)
            return result.valid === false && result.error !== undefined
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('validateFile (combined validation)', () => {
    it('should accept valid files (correct type and size)', () => {
      const file = createMockFile('image/png', 5 * 1024 * 1024)
      const result = validateFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject files with invalid type even if size is valid', () => {
      const file = createMockFile('application/pdf', 1000)
      const result = validateFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('file type')
    })

    it('should reject files with invalid size even if type is valid', () => {
      const file = createMockFile('image/jpeg', MAX_FILE_SIZE + 1)
      const result = validateFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('10MB')
    })

    // Property-based test: 有效类型 + 有效大小 = 有效文件
    it('Property: valid type AND valid size should result in valid file', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_IMAGE_TYPES),
          fc.integer({ min: 1, max: MAX_FILE_SIZE }),
          (type, size) => {
            const file = createMockFile(type, size)
            const result = validateFile(file)
            return result.valid === true
          }
        ),
        { numRuns: 100 }
      )
    })

    // Property-based test: 无效类型 = 无效文件（无论大小）
    it('Property: invalid type should result in invalid file regardless of size', () => {
      const invalidTypes = ['image/bmp', 'application/pdf', 'text/plain', 'video/mp4']
      
      fc.assert(
        fc.property(
          fc.constantFrom(...invalidTypes),
          fc.integer({ min: 1, max: MAX_FILE_SIZE }),
          (type, size) => {
            const file = createMockFile(type, size)
            const result = validateFile(file)
            return result.valid === false
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
