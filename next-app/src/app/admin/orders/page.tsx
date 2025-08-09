"use client"

import Link from 'next/link'
import { useOrders, type OrderWithProduct } from '@/hooks/useOrders'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const statusFlow = ['pending', 'confirmed', 'completed', 'denied']

export default function Page() {
  const { orders, loading, error, refetch } = useOrders()
  const { user, loading: authLoading, profileLoaded } = useAuth()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [localOrders, setLocalOrders] = useState<OrderWithProduct[]>(orders)
  const [denialModalOpen, setDenialModalOpen] = useState(false)
  const [denialReason, setDenialReason] = useState('')
  const [pendingDenyOrder, setPendingDenyOrder] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (authLoading || !profileLoaded) return
    if (!user) router.replace('/login')
    else if (user.role !== 'admin') router.replace('/')
  }, [user, authLoading, profileLoaded, router])

  useEffect(() => { setLocalOrders(orders) }, [orders])

  const updateOrderStatus = async (orderId: string, newStatus: string, prevStatus?: string, denialReasonValue?: string) => {
    const order = localOrders.find(o => o.id === orderId)
    const updateObj: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'denied' && denialReasonValue) { updateObj.denial_reason = denialReasonValue } else if (newStatus !== 'denied') { updateObj.denial_reason = null }
    const { error } = await supabase.from('orders').update(updateObj).eq('id', orderId)
    if (error) { setUpdateError('Failed to update status: ' + error.message) } else {
      setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, denial_reason: (typeof updateObj.denial_reason === 'string' ? updateObj.denial_reason : undefined) } : o))
      if (newStatus === 'denied' && prevStatus !== 'denied') {
        const productId = order?.product_id
        if (productId && order?.product) { await supabase.from('products').update({ stocks: order.product.stocks + 1 }).eq('id', productId); setToast('Stock restored for denied order.') }
      }
      if (prevStatus === 'denied' && newStatus !== 'denied') {
        const productId = order?.product_id
        if (productId && order?.product && order.product.stocks > 0) { await supabase.from('products').update({ stocks: order.product.stocks - 1 }).eq('id', productId) }
      }
    }
    setUpdatingId(null)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    setUpdateError(null)
    const order = localOrders.find(o => o.id === orderId)
    const prevStatus = order?.status
    if (newStatus === 'denied' && prevStatus !== 'denied') { setPendingDenyOrder(orderId); setDenialModalOpen(true); return }
    await updateOrderStatus(orderId, newStatus, prevStatus)
  }

  const handleDenialSubmit = async () => { if (!pendingDenyOrder || !denialReason.trim()) return; await updateOrderStatus(pendingDenyOrder, 'denied', undefined, denialReason.trim()); setDenialModalOpen(false); setDenialReason(''); setPendingDenyOrder(null) }
  const handleDenialCancel = () => { setDenialModalOpen(false); setDenialReason(''); setPendingDenyOrder(null); setUpdatingId(null) }

  if (authLoading || loading || !profileLoaded) { return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-lg text-gray-600">Loading orders...</div></div> }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">Back to Dashboard</Link>
        </div>
        {updateError && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700 text-sm">{updateError}</p></div>)}
        <div className="bg-white shadow-lg border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Order ID</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Product</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Buyer</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Payment Proof</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Current Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Change Status</th>
                </tr>
              </thead>
              <tbody>
                {localOrders.map((order, index) => (
                  <tr key={order.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border-b border-gray-200 group`}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-mono text-xs text-gray-600 border-r border-gray-200 bg-gray-50">{order.id}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200">
                      {order.product ? (
                        <div className="flex items-center gap-2">
                          {order.product.image_url && (<div className="relative h-8 w-8"><Image src={order.product.image_url} alt={order.product.name} className="object-cover rounded" fill /></div>)}
                          <span className="text-sm font-medium text-gray-900">{order.product.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unknown Product</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200"><span className="text-sm text-gray-900">{order.buyer_name}</span></td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200">
                      {order.payment_proof_url ? (
                        <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                          <div className="relative h-12 w-12">
                            <Image src={order.payment_proof_url} alt="Proof" fill className="object-cover rounded border hover:scale-105 transition-transform" />
                          </div>
                        </a>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                          {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">{new Date(order.created_at || '').toLocaleDateString()}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <select value={order.status || 'pending'} onChange={(e) => handleStatusChange(order.id, e.target.value)} disabled={updatingId === order.id} className="text-xs border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50">
                          {statusFlow.map(status => (<option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>))}
                        </select>
                        {updatingId === order.id && (<span className="text-pink-600 text-xs">Updating...</span>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {localOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
          </div>
        )}
      </div>
      <Modal open={denialModalOpen} onClose={handleDenialCancel} title="Deny Order">
        <div className="space-y-4">
          <p className="text-gray-600">Please provide a reason for denying this order:</p>
          <textarea value={denialReason} onChange={(e) => setDenialReason(e.target.value)} placeholder="Enter denial reason..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" rows={3} />
          <div className="flex gap-3 justify-end">
            <button onClick={handleDenialCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button onClick={handleDenialSubmit} disabled={!denialReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">Deny Order</button>
          </div>
        </div>
      </Modal>
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
          <button className="ml-2 text-white/80 hover:text-white" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </div>
  )
} 