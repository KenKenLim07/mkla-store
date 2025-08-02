// validateImage.ts - Image validation utility functions

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DIMENSION = 2000 // 2000px max width/height

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export interface ImageDimensions {
  width: number
  height: number
}

/**
 * Validates an image file for type, size, and dimensions
 */
export const validateImage = async (file: File): Promise<ImageValidationResult> => {
  const warnings: string[] = []

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please use: ${ALLOWED_TYPES.join(', ')}`
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB`
    }
  }

  // Check dimensions
  try {
    const dimensions = await getImageDimensions(file)
    
    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
      warnings.push(`Image is very large (${dimensions.width}x${dimensions.height}). Consider resizing for better performance.`)
    }

    // Check aspect ratio (warn if very extreme)
    const aspectRatio = dimensions.width / dimensions.height
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      warnings.push('Image has an extreme aspect ratio. Square or rectangular images work best.')
    }

  } catch (error) {
    return {
      isValid: false,
      error: 'Could not read image dimensions. Please try a different file.'
    }
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Gets image dimensions from a file
 */
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Compresses an image file if it's too large
 */
export const compressImage = async (
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Canvas not supported'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
} 