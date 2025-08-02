// sanitize.ts - Input sanitization utilities for security

/**
 * Sanitizes a string by removing potentially harmful characters
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 1000) // Limit length
}

/**
 * Sanitizes email input
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') return ''
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, '') // Only allow email characters
    .slice(0, 254) // RFC 5321 limit
}

/**
 * Sanitizes phone number input
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') return ''
  
  return phone.replace(/[^0-9+\-\s()]/g, '').slice(0, 20)
}

/**
 * Sanitizes name input (for full names, product names, etc.)
 */
export const sanitizeName = (name: string): string => {
  if (typeof name !== 'string') return ''
  
  return name
    .trim()
    .replace(/[^a-zA-Z\s\-']/g, '') // Allow letters, spaces, hyphens, apostrophes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 100)
}

/**
 * Sanitizes text input (descriptions, etc.)
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return ''
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 2000) // Reasonable limit for descriptions
}

/**
 * Validates and sanitizes price input
 */
export const sanitizePrice = (price: string | number): number => {
  if (typeof price === 'number') {
    return isNaN(price) ? 0 : Math.max(0, Math.round(price * 100) / 100)
  }
  
  if (typeof price !== 'string') return 0
  
  const cleaned = price.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed * 100) / 100)
}

/**
 * Validates and sanitizes quantity/stock input
 */
export const sanitizeQuantity = (quantity: string | number): number => {
  if (typeof quantity === 'number') {
    return isNaN(quantity) ? 0 : Math.max(0, Math.floor(quantity))
  }
  
  if (typeof quantity !== 'string') return 0
  
  const cleaned = quantity.replace(/[^0-9]/g, '')
  const parsed = parseInt(cleaned, 10)
  
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}

/**
 * Sanitizes URL input
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') return ''
  
  const trimmed = url.trim()
  
  // Allow only http/https URLs or relative paths
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed.slice(0, 500)
  }
  
  return ''
}

/**
 * Rate limiting helper - simple in-memory store
 */
const rateLimitStore = new Map<string, { count: number; lastReset: number }>()

/**
 * Simple rate limiting check
 */
export const checkRateLimit = (
  key: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitStore.set(key, { count: 1, lastReset: now })
    return true
  }
  
  if (record.count >= maxAttempts) {
    return false
  }
  
  record.count++
  return true
}