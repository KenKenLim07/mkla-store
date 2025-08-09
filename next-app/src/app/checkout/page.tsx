"use client"

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/db'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { compressImage, ImageCompressor } from '@/utils/imageCompression'
import Image from 'next/image'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [proof, setProof] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [compressionInfo, setCompressionInfo] = useState<{ originalSize: string; compressedSize: string; compressionRatio: number; isCompressing: boolean } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const productId = searchParams.get('product')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!productId) { setError('No product selected for checkout.'); setLoading(false); return }
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
      if (error || !data) { setError('Product not found.'); setLoading(false); return }
      setProduct(data); setLoading(false)
    }
    fetchProduct()
  }, [productId])

  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) { setProof(null); setProofPreview(null); setCompressionInfo(null); return }
    const validation = ImageCompressor.validateFile(file)
    if (!validation.valid) { setError(validation.error || 'Invalid file'); setProof(null); setProofPreview(null); setCompressionInfo(null); return }
    setError(null)
    setCompressionInfo({ originalSize: ImageCompressor.formatFileSize(file.size), compressedSize: '', compressionRatio: 1, isCompressing: true })
    try {
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8, maxFileSize: 500 * 1024 })
      setProof(compressed.file)
      setCompressionInfo({ originalSize: ImageCompressor.formatFileSize(compressed.originalSize), compressedSize: ImageCompressor.formatFileSize(compressed.compressedSize), compressionRatio: compressed.compressionRatio, isCompressing: false })
      const reader = new FileReader(); reader.onloadend = () => setProofPreview(reader.result as string); reader.readAsDataURL(compressed.file)
    } catch { setError('Failed to process image. Please try again.'); setProof(null); setProofPreview(null); setCompressionInfo(null) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerName.trim()) { setError('Please enter your name.'); return }
    if (!proof) { setError('Please upload your GCash payment proof.'); return }
    if (product?.stocks === 0) { setError('Sorry, this product is out of stock.'); return }
    setError(null); setSubmitting(true); setProgress(0)
    let payment_proof_url: string | undefined = undefined
    if (proof) {
      const fileExt = proof.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `orders/${fileName}`
      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, proof, { cacheControl: '3600', upsert: false } as { cacheControl: string; upsert: boolean })
      if (uploadError) { setError('Failed to upload payment proof: ' + uploadError.message); setSubmitting(false); return }
      payment_proof_url = supabase.storage.from('payment-proofs').getPublicUrl(filePath).data.publicUrl
      setProgress(60)
    }
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({ product_id: product?.id, buyer_name: buyerName.trim(), payment_proof_url, status: 'pending', user_id: user?.id }).select().single()
    if (orderError) { setError('Failed to create order: ' + orderError.message); setSubmitting(false); return }
    setProgress(100); setSuccess(true); setOrderId(orderData.id); setSubmitting(false)
    const { error: stockError } = await supabase.from('products').update({ stocks: (product?.stocks ?? 1) - 1 }).eq('id', product?.id)
    if (stockError) { setError('Order placed, but failed to update stock: ' + stockError.message) }
  }

  if (authLoading || loading) { return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-lg text-gray-600">Loading...</div></div> }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Sign in to Checkout</h2>
          <p className="text-gray-700 mb-4">You need to be signed in to place an order. Please log in or create an account to continue.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Log In</button>
            <button onClick={() => router.push('/register')} className="px-4 py-2 bg-gray-200 text-pink-700 rounded hover:bg-gray-300">Sign Up</button>
          </div>
        </div>
      </div>
    )
  }

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your checkout is empty</h2>
          <p className="text-gray-600 mb-4">Please select a product to continue with your purchase.</p>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Browse Products</button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase. We&apos;ll process your order soon.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4"><p className="text-sm text-gray-600">Order ID: <span className="font-mono font-medium">{orderId}</span></p></div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/orders')} className="flex-1 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">View Orders</button>
            <button onClick={() => router.push('/')} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Continue Shopping</button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) { return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-lg text-gray-600">Loading product...</div></div> }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push(`/payment?product=${productId}`)} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeftIcon className="h-5 w-5 mr-2" />Back to Payment</button>
            <h1 className="text-lg font-semibold text-gray-900">Complete Order</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 text-white" /></div>
            <div className="w-16 h-1 bg-green-500 mx-2"></div>
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center"><span className="text-white text-sm font-medium">2</span></div>
          </div>
        </div>
        <div className="text-center mb-6"><h2 className="text-xl font-semibold text-gray-900">Upload Payment Proof</h2><p className="text-gray-600 text-sm">Please upload a screenshot of your GCash payment</p></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            {product.image_url ? (
              <div className="relative w-16 h-16">
                <Image src={product.image_url} alt={product.name} fill className="object-cover rounded-lg" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><span className="text-gray-400 text-2xl">🖼️</span></div>
            )}
            <div className="flex-1"><h3 className="text-lg font-semibold text-gray-900">{product.name}</h3><p className="text-gray-600 text-sm">{product.description}</p></div>
            <div className="text-right"><div className="text-2xl font-bold text-pink-600">₱{product.price.toFixed(2)}</div></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input type="text" id="buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent" placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GCash Payment Proof *</label>
              <div className="space-y-4">
                <div className="relative">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProofChange} className="hidden" required />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400">
                    <div className="text-center">
                      {proof ? (
                        <div className="flex items-center justify-center space-x-3 animate-fade-in">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                          <div className="text-left"><p className="text-sm font-medium text-gray-900">{proof.name}</p><p className="text-xs text-gray-500">Click to change file</p></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto"><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg></div>
                          <div><p className="text-sm font-medium text-gray-900">Click to upload payment proof</p><p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="mt-3 flex items-center justify-center"><span className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">📱 Screenshot of GCash payment</span></div>
                </div>
                {compressionInfo && (
                  <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg border">
                    {compressionInfo.isCompressing ? (
                      <div className="flex items-center space-x-2"><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-pink-500"></div><span>Optimizing image...</span></div>
                    ) : (
                      <>
                        <div>Original: {compressionInfo.originalSize}</div>
                        <div>Optimized: {compressionInfo.compressedSize}</div>
                        {compressionInfo.compressionRatio < 1 && (<div className="text-green-600">Saved {((1 - compressionInfo.compressionRatio) * 100).toFixed(1)}% space</div>)}
                      </>
                    )}
                  </div>
                )}
                {proofPreview && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-medium text-gray-900">Preview</h4><button type="button" onClick={() => { setProof(null); setProofPreview(null); setCompressionInfo(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="text-xs text-red-600 hover:text-red-800 transition-colors">Remove</button></div>
                    <div className="relative w-full h-64">
                      <Image src={proofPreview} alt="Payment proof preview" fill className="object-contain rounded border" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && (<div className="bg-red-50 border border-red-200 rounded-md p-4"><p className="text-red-700 text-sm">{error}</p></div>)}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting || compressionInfo?.isCompressing} className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? (<span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span>) : ('Place Order')}</button>
              <button type="button" onClick={() => router.push('/')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">Back to Store</button>
            </div>
            {submitting && (<div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>)}
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
} 