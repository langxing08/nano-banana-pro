'use client'

import { useState, useCallback } from 'react'

export interface UseClipboardResult {
  copied: boolean
  error: string | null
  copyToClipboard: (text: string) => Promise<boolean>
}

/**
 * Custom hook for clipboard operations
 * Requirements: 10.1
 */
export function useClipboard(): UseClipboardResult {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    setCopied(false)
    setError(null)

    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available')
      }

      await navigator.clipboard.writeText(text)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return true
    } catch (err) {
      const errorMessage = 'Failed to copy. Please try again.'
      setError(errorMessage)
      return false
    }
  }, [])

  return {
    copied,
    error,
    copyToClipboard,
  }
}
