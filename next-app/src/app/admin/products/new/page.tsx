"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user, loading: authLoading, profileLoaded } = useAuth()
  const router = useRouter()

  const handleCreate = async (form: { name: string; description: string; price: string; image?: File | null; stocks?: number }) => {
    setError(null)
    setLoading(true)
    setProgress(0)
    let image_url: string | undefined = undefined

    if (form.image) {
      const fileExt = form.image.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, form.image, { cacheControl: '3600', upsert: false, contentType: form.image.type } as { cacheControl: string; upsert: boolean; contentType: string })
      if (uploadError) { setError('Failed to upload image: ' + uploadError.message); setLoading(false); return }
      image_url = supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl
      setProgress(50)
    }

    const { error: insertError } = await supabase.from('products').insert({ name: form.name, description: form.description, price: Number(form.price), image_url, stocks: form.stocks ?? 0 })
    if (insertError) { setError('Failed to create product: ' + insertError.message); setLoading(false); return }

    setProgress(100)
    setSuccess(true)
    setTimeout(() => { setLoading(false); router.push('/admin/products') }, 1500)
  }

  if (authLoading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-pink-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                  <div className="h-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (!user) { router.replace('/login'); return null }
  if (user.role !== 'admin') { router.replace('/'); return null }

  if (success) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircleIcon className="w-8 h-8 text-pink-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Created!</h2>
          <p className="text-gray-600 mb-6">Your new product has been successfully added to the store.</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/admin/products')} className="flex-1 bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors">View Products</button>
            <button onClick={() => window.location.reload()} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">Add Another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeftIcon className="h-5 w-5" /><span className="font-medium">Back to Products</span></Link>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-600">Expand your store catalog</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-pink-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><PlusIcon className="w-5 h-5 text-white" /></div>
                  <div><h2 className="text-lg font-semibold text-white">Product Information</h2><p className="text-pink-100 text-sm">Fill in the details below</p></div>
                </div>
              </div>
              <div className="p-6">
                <ProductForm mode="create" onSubmit={handleCreate} loading={loading} error={error} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Creating Product...</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Progress</span><span>{progress}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 ${progress >= 25 ? 'text-green-600' : 'text-gray-400'}`}><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${progress >= 25 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{progress >= 25 ? '✓' : '1'}</div><span className="text-sm">Validating form</span></div>
                  <div className={`flex items-center gap-3 ${progress >= 50 ? 'text-green-600' : 'text-gray-400'}`}><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${progress >= 50 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{progress >= 50 ? '✓' : '2'}</div><span className="text-sm">Uploading image</span></div>
                  <div className={`flex items-center gap-3 ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${progress >= 100 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{progress >= 100 ? '✓' : '3'}</div><span className="text-sm">Saving product</span></div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Great Products</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3"><div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div><p>Use clear, descriptive product names</p></div>
                <div className="flex items-start gap-3"><div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div><p>Add detailed descriptions to help customers</p></div>
                <div className="flex items-start gap-3"><div className="w-2 h-2 bg-pink-300 rounded-full mt-2 flex-shrink-0"></div><p>Upload high-quality product images</p></div>
                <div className="flex items-start gap-3"><div className="w-2 h-2 bg-pink-200 rounded-full mt-2 flex-shrink-0"></div><p>Set accurate stock levels</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/admin/products" className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">View All Products</Link>
                <Link href="/admin" className="block w-full text-center bg-pink-100 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium">Back to Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 