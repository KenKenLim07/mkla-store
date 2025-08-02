import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useOrders, type OrderWithProduct } from '../hooks/useOrders'

const statusOrder = ['pending', 'confirmed', 'completed', 'denied']
const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  denied: 'Denied',
}
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-700',
}

function formatPrice(price?: number) {
  if (typeof price !== 'number') return ''
  return `₱${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

function StatusTimeline({ status }: { status: string }) {
  const steps = useMemo(() => ['pending', 'confirmed', status === 'denied' ? 'denied' : 'completed'], [status])
  const currentIdx = useMemo(() => steps.indexOf(status), [steps, status])
  
  return (
    <div className="flex items-center gap-2 mt-2" aria-label="Order status timeline">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${idx <= currentIdx ? statusColors[step] : 'bg-gray-200'}`}
            aria-label={statusLabels[step]}
          />
          {idx < steps.length - 1 && <span className="w-6 h-0.5 bg-gray-200" />}
        </div>
      ))}
      <span className="ml-2 text-xs text-gray-500">{statusLabels[status]}</span>
    </div>
  )
}

function PaymentProofModal({ open, onClose, imageUrl }: { open: boolean, onClose: () => void, imageUrl: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close modal"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <img src={imageUrl} alt="Payment Proof" className="w-full h-auto rounded" />
      </div>
    </div>
  )
}

export const Orders = () => {
  const { user, loading: authLoading } = useAuth()
  const { orders, loading, error } = useOrders()
  const [userOrders, setUserOrders] = useState<OrderWithProduct[]>([])
  const [proofModal, setProofModal] = useState<{ open: boolean, url: string }>({ open: false, url: '' })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const navigate = useNavigate()

  // Memoized functions to prevent re-renders
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  const closeProofModal = useCallback(() => {
    setProofModal({ open: false, url: '' })
  }, [])

  const openProofModal = useCallback((url: string) => {
    setProofModal({ open: true, url })
  }, [])

  const handleCopyOrderId = useCallback((orderId: string) => {
    copyToClipboard(orderId)
    setCopiedId(orderId)
    setTimeout(() => setCopiedId(null), 1500)
  }, [copyToClipboard])

  const handleContactSupport = useCallback((orderId: string) => {
    window.open(`mailto:support@yourstore.com?subject=Order%20Appeal%20${orderId}`, '_blank')
  }, [])

  // Filter orders for current user
  useEffect(() => {
    if (user && orders) {
      const filtered = orders.filter(order => order.user_id === user.id)
      setUserOrders(filtered)
    }
  }, [user, orders])

  // Memoized grouped orders to prevent recalculation on every render
  const groupedOrders = useMemo(() => {
    return statusOrder.map(status => ({
      status,
      orders: userOrders.filter(o => o.status === status)
    })).filter(group => group.orders.length > 0)
  }, [userOrders])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading your orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet. Start shopping now!</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your order status and view payment proofs</p>
        </div>

        <div className="space-y-8">
          {groupedOrders.map(group => (
            <div key={group.status}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                {group.status} Orders ({group.orders.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 flex flex-col bg-gray-50 shadow-sm relative group focus-within:ring-2 focus-within:ring-pink-400">
                    <div className="flex items-center gap-4 mb-2">
                      {order.product?.image_url ? (
                        <img src={order.product.image_url} alt={order.product.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          🛍️
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-base text-gray-900 truncate" title={order.product?.name}>
                            {order.product?.name || 'Unknown Product'}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[order.status || 'pending']}`}>
                            {statusLabels[order.status || 'pending']}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          Order ID: <span className="font-mono">{order.id}</span>
                          <button
                            className="ml-1 text-pink-500 hover:text-pink-700 focus:outline-none"
                            aria-label="Copy order ID"
                            onClick={() => handleCopyOrderId(order.id)}
                          >
                            {copiedId === order.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Placed: {new Date(order.created_at || '').toLocaleString()}
                        </div>
                        {order.product?.price && (
                          <div className="text-xs text-gray-700 mb-1">
                            Price: <span className="font-semibold">{formatPrice(order.product.price)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <StatusTimeline status={order.status || 'pending'} />
                    <div className="mt-2 flex flex-col gap-2">
                      {order.payment_proof_url && (
                        <button
                          onClick={() => openProofModal(order.payment_proof_url!)}
                          className="text-xs text-pink-600 hover:text-pink-800 focus:outline-none text-left"
                        >
                          📸 View Payment Proof
                        </button>
                      )}
                      {order.denial_reason && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          <strong>Denial Reason:</strong> {order.denial_reason}
                          <button
                            onClick={() => handleContactSupport(order.id)}
                            className="ml-2 text-pink-600 hover:text-pink-800 underline"
                          >
                            Contact Support
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaymentProofModal
        open={proofModal.open}
        onClose={closeProofModal}
        imageUrl={proofModal.url}
      />
    </div>
  )
} 