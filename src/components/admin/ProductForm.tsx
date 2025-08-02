import { useState, useRef } from 'react'
import type { Product } from '../../types/db'
import { compressImage, ImageCompressor } from '../../utils/imageCompression'
import { PlusIcon } from '@heroicons/react/24/outline'

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<Product>
  onSubmit: (data: FormData) => Promise<void>
  loading?: boolean
  error?: string | null
}

interface FormData {
  name: string
  description: string
  price: string
  image?: File | null
  stocks?: number
}

interface CompressionInfo {
  originalSize: string
  compressedSize: string
  compressionRatio: number
  isCompressing: boolean
}

export const ProductForm = ({ mode, initialData = {}, onSubmit, loading, error }: ProductFormProps) => {
  const [form, setForm] = useState<FormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price ? String(initialData.price) : '',
    image: undefined,
    stocks: initialData.stocks || 0
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.image_url || null)
  const [compressionInfo, setCompressionInfo] = useState<CompressionInfo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (): boolean => {
    if (!form.name.trim()) {
      setFormError('Product name is required')
      return false
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setFormError('Price must be a positive number')
      return false
    }
    if (!form.stocks && form.stocks !== 0) {
      setFormError('Stocks is required')
      return false
    }
    if (form.stocks < 0) {
      setFormError('Stocks cannot be negative')
      return false
    }
    setFormError(null)
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      setForm((prev) => ({ ...prev, image: undefined }))
      setPreviewUrl(null)
      setCompressionInfo(null)
      return
    }

    // Validate file
    const validation = ImageCompressor.validateFile(file)
    if (!validation.valid) {
      setFormError(validation.error || 'Invalid file')
      setForm((prev) => ({ ...prev, image: undefined }))
      setPreviewUrl(null)
      setCompressionInfo(null)
      return
    }

    setFormError(null)
    setCompressionInfo({ 
      originalSize: ImageCompressor.formatFileSize(file.size),
      compressedSize: '',
      compressionRatio: 1,
      isCompressing: true 
    })

    try {
      // Compress image
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxFileSize: 500 * 1024 // 500KB
      })

      // Update form with compressed file
      setForm((prev) => ({ ...prev, image: compressed.file }))
      
      // Update compression info
      setCompressionInfo({
        originalSize: ImageCompressor.formatFileSize(compressed.originalSize),
        compressedSize: ImageCompressor.formatFileSize(compressed.compressedSize),
        compressionRatio: compressed.compressionRatio,
        isCompressing: false
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(compressed.file)

    } catch (error) {
      setFormError('Failed to process image. Please try again.')
      setForm((prev) => ({ ...prev, image: undefined }))
      setPreviewUrl(null)
      setCompressionInfo(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({ ...form, stocks: form.stocks })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
          placeholder="Enter product name..."
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
          placeholder="Describe your product..."
        />
      </div>

      {/* Price and Stocks Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-semibold text-gray-900">
            Price (₱) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₱</span>
            <input
              type="number"
              name="price"
              id="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="stocks" className="block text-sm font-semibold text-gray-900">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stocks"
            name="stocks"
            min={0}
            required
            value={form.stocks ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900"
            placeholder="Available quantity"
          />
        </div>
      </div>
      {/* Product Image */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-900">
          Product Image
        </label>
        
        {/* Image Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-pink-400 transition-colors duration-200">
          <div className="text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, image: undefined }))
                      setPreviewUrl(null)
                      setCompressionInfo(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  {compressionInfo?.isCompressing ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload product image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium"
            >
              Choose File
            </button>
          </div>
        </div>
        
        {/* Compression info */}
        {compressionInfo && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {compressionInfo.isCompressing ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                <span>Optimizing image...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original:</span>
                  <span className="font-medium">{compressionInfo.originalSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Optimized:</span>
                  <span className="font-medium text-green-600">{compressionInfo.compressedSize}</span>
                </div>
                {compressionInfo.compressionRatio < 1 && (
                  <div className="text-sm text-green-600 font-medium text-center">
                    ✨ Saved {((1 - compressionInfo.compressionRatio) * 100).toFixed(1)}% space
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* Error Display */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{formError || error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || compressionInfo?.isCompressing}
          className="w-full bg-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {mode === 'edit' ? 'Saving Changes...' : 'Creating Product...'}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <PlusIcon className="w-5 h-5" />
              {mode === 'edit' ? 'Save Changes' : 'Create Product'}
            </div>
          )}
        </button>
      </div>
    </form>
  )
} 