/**
 * Image processing utilities for the Nano Banana Image Editor
 * Requirements: 1.1, 1.3, 1.4
 */

// Supported image types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates if the file type is supported (JPEG, PNG, WebP, GIF)
 * @param file - The file to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFileType(file: File): ValidationResult {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload JPEG, PNG, WebP, or GIF.',
    };
  }
  return { valid: true };
}

/**
 * Validates if the file size is within the limit (10MB)
 * @param file - The file to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    };
  }
  return { valid: true };
}

/**
 * Validates both file type and size
 * @param file - The file to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFile(file: File): ValidationResult {
  const typeResult = validateFileType(file);
  if (!typeResult.valid) {
    return typeResult;
  }

  const sizeResult = validateFileSize(file);
  if (!sizeResult.valid) {
    return sizeResult;
  }

  return { valid: true };
}

/**
 * Generates a base64 preview URL for an image file
 * @param file - The image file to generate preview for
 * @returns Promise resolving to base64 data URL
 */
export function generatePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to generate preview.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsDataURL(file);
  });
}
