"use client"

import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import type { Product } from '@/types/db'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function Page() {
  const { products, loading, refetch } = useProducts()
  const { user, loading: authLoading, profileLoaded } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stockInput, setStockInput] = useState<number | null>(null)
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null)
  const [stockError, setStockError] = useState<string | null>(null)
  const [localProducts, setLocalProducts] = useState(products)
  const router = useRouter()

  useEffect(() => { if (!authLoading && profileLoaded) { if (!user) router.replace('/login'); else if (user.role !== 'admin') router.replace('/') } }, [user, authLoading, profileLoaded, router])
  useEffect(() => { setLocalProducts(products) }, [products])

  const filteredProducts = useMemo(() => localProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description?.toLowerCase().includes(searchTerm.toLowerCase())), [localProducts, searchTerm])

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) { alert('Failed to delete product: ' + error.message); return }
      setLocalProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      alert('Unexpected error: ' + (err as Error).message)
    }
    setDeleteProductId(null)
  }

  const handleStockEdit = (product: Product) => { setEditingStockId(product.id); setStockInput(product.stocks); setStockError(null) }
  const handleStockSave = async (product: Product) => {
    if (stockInput == null || stockInput < 0) { setStockError('Stocks must be 0 or more'); return }
    setUpdatingStockId(product.id); setStockError(null)
    const { error } = await supabase.from('products').update({ stocks: stockInput }).eq('id', product.id)
    if (error) { setStockError('Failed to update stocks: ' + error.message) } else { setEditingStockId(null); setStockInput(null); await refetch() }
    setUpdatingStockId(null)
  }

  if (authLoading || loading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div><div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="bg-white p-6 rounded-lg shadow"><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/3"></div></div>))}</div></div></div></div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="mt-2 text-gray-600">Add, edit, or remove products from your store.</p>
            </div>
            <Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" /> Add Product
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search products</label>
              <div className="relative">
                <input type="text" id="search" placeholder="Search products by name or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center">{filteredProducts.length} of {products.length} products</div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <p className="text-gray-500 mb-4">No products found matching &quot;{searchTerm}&quot;</p>
                  <button onClick={() => setSearchTerm('')} className="text-pink-600 hover:text-pink-500">Clear search</button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"><PlusIcon className="h-4 w-4 mr-2" /> Add your first product</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Product</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Price</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Stocks</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border-b border-gray-200 group`}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          {product.image_url && (
                            <div className="relative h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4">
                              <Image src={product.image_url} alt={product.name} className="rounded-lg object-cover" fill />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                            {product.description && (<div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">{product.description}</div>)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">₱{product.price.toFixed(2)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {editingStockId === product.id ? (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <input type="number" min={0} value={stockInput ?? ''} onChange={e => setStockInput(Number(e.target.value))} className="w-16 sm:w-20 px-2 py-1 border rounded focus:border-pink-500 focus:ring-pink-500 text-xs sm:text-sm" disabled={updatingStockId === product.id} />
                            <button onClick={() => handleStockSave(product)} disabled={updatingStockId === product.id} className="px-1.5 sm:px-2 py-1 bg-pink-600 text-white rounded text-xs font-semibold hover:bg-pink-700 disabled:opacity-50">{updatingStockId === product.id ? (<svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : 'Save'}</button>
                            <button onClick={() => setEditingStockId(null)} className="px-1.5 sm:px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300" disabled={updatingStockId === product.id}>Cancel</button>
                          </div>
                        ) : (
                          <span className={`font-mono px-2 py-1 rounded ${product.stocks === 0 ? 'bg-red-100 text-red-700' : product.stocks <= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`} title={product.stocks === 0 ? 'Out of Stock' : product.stocks <= 5 ? 'Low Stock' : undefined}>{product.stocks}</span>
                        )}
                        {editingStockId === product.id && stockError && (<div className="text-xs text-red-500 mt-1">{stockError}</div>)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-900 p-1.5 sm:p-1" title="Edit product"><PencilIcon className="h-4 w-4" /></Link>
                          <button onClick={() => handleStockEdit(product)} className="text-yellow-600 hover:text-yellow-900 p-1.5 sm:p-1" title="Edit stocks"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h6m2 2a2 2 0 11-4 0 2 2 0 014 0zm-6 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg></button>
                          <Link href={`/product/${product.id}`} className="text-gray-600 hover:text-gray-900 p-1.5 sm:p-1" title="View product"><EyeIcon className="h-4 w-4" /></Link>
                          <button onClick={() => setDeleteProductId(product.id)} className="text-red-600 hover:text-red-900 p-1.5 sm:p-1" title="Delete product"><TrashIcon className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteProductId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setDeleteProductId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
                <button onClick={() => handleDelete(deleteProductId)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 