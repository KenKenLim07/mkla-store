"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/db'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const productId = searchParams.get('product')
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!productId) { setError('No product selected for payment.'); setLoading(false); return }
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
      if (error || !data) { setError('Product not found.'); setLoading(false); return }
      setProduct(data); setLoading(false)
    }
    fetchProduct()
  }, [productId])

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Sign in to Continue</h2>
          <p className="text-gray-700 mb-4">You need to be signed in to make a payment.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Log In</button>
            <button onClick={() => router.push('/register')} className="px-4 py-2 bg-gray-200 text-pink-700 rounded hover:bg-gray-300">Sign Up</button>
          </div>
        </div>
      </div>
    )
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Back to Store</button>
        </div>
      </div>
    )
  }

  const handleDonePayment = () => { router.push(`/checkout?product=${productId}`) }
  const handleBackToProduct = () => { router.push('/') }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleBackToProduct} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeftIcon className="h-5 w-5 mr-2" />Back to Store</button>
            <h1 className="text-lg font-semibold text-gray-900">GCash Payment</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            {product.image_url ? (
              <div className="relative w-16 h-16">
                <Image src={product.image_url} alt={product.name} fill className="object-cover rounded-lg" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><span className="text-gray-400 text-2xl">🖼️</span></div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
            <div className="text-right"><div className="text-2xl font-bold text-pink-600">₱{product.price.toFixed(2)}</div></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Scan QR Code</h3>
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                  <div className="relative w-full h-full p-4">
                    <Image src="/cash-qr-code.png" alt="GCash QR Code" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">Point your GCash camera at this QR code</p>
            <p className="text-xs text-gray-400 mt-2">Make sure your phone&apos;s camera is focused on the QR code</p>
          </div>
          <div className="border-t border-gray-200 mb-8"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Pay</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start"><div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-0.5"><span className="text-pink-600 text-xs font-semibold">1</span></div><p>Open your GCash app and tap &quot;Pay QR&quot;</p></div>
              <div className="flex items-start"><div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-0.5"><span className="text-pink-600 text-xs font-semibold">2</span></div><p>Scan the QR code above</p></div>
              <div className="flex items-start"><div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-0.5"><span className="text-pink-600 text-xs font-semibold">3</span></div><p>Enter the amount: <span className="font-semibold text-gray-900">₱{product.price.toFixed(2)}</span></p></div>
              <div className="flex items-start"><div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-0.5"><span className="text-pink-600 text-xs font-semibold">4</span></div><p>Complete the payment and take a screenshot</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleDonePayment} className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2" />I&apos;ve Completed Payment</button>
            <button onClick={handleBackToProduct} className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors">Cancel Payment</button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">You&apos;ll be asked to upload payment proof on the next step</p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  )
} 