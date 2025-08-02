// Image compression utility for optimizing uploads
interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxFileSize?: number // in bytes
  format?: 'jpeg' | 'webp' | 'png'
}

interface CompressedImage {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  maxFileSize: 500 * 1024, // 500KB
  format: 'jpeg'
}

export class ImageCompressor {
  private options: CompressionOptions

  constructor(options: Partial<CompressionOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Compress an image file with the specified options
   */
  async compress(file: File): Promise<CompressedImage> {
    // Check if file is already small enough
    if (file.size <= this.options.maxFileSize!) {
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 1
      }
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            this.options.maxWidth!,
            this.options.maxHeight!
          )

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw and compress image
          ctx!.drawImage(img, 0, 0, width, height)

          // Convert to blob with specified quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }

              // Create new file with compressed data
              const compressedFile = new File([blob], file.name, {
                type: `image/${this.options.format}`,
                lastModified: Date.now()
              })

              const compressionRatio = compressedFile.size / file.size

              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                compressionRatio
              })
            },
            `image/${this.options.format}`,
            this.options.quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Calculate new dimensions while maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight }

    // Scale down if image is larger than max dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    return { width, height }
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' }
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' }
    }

    return { valid: true }
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Convenience function for quick compression
export const compressImage = async (
  file: File,
  options?: Partial<CompressionOptions>
): Promise<CompressedImage> => {
  const compressor = new ImageCompressor(options)
  return compressor.compress(file)
} 