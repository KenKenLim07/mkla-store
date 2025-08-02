import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { PlusIcon, ShoppingBagIcon, CurrencyDollarIcon, UserGroupIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const { products, loading: productsLoading } = useProducts()
  const { orders, loading: ordersLoading } = useOrders()

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/admin/products'
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      href: '/admin/orders'
    },
    {
      name: 'Total Customers',
      value: 0, // TODO: Add customers hook
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      href: '/admin/customers'
    }
  ]

  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center gap-4">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-2 flex items-center justify-center`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to={stat.href}
                    className="font-medium text-blue-700 hover:text-blue-900"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex gap-4 mb-4">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Add New Product
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
            >
              <PencilIcon className="h-5 w-5 mr-2" /> Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
            >
              <EyeIcon className="h-5 w-5 mr-2" /> View Orders
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
            <Link
              to="/admin/products"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              View All Products →
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first product to the store.</p>
              <Link
                to="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  to={`/admin/products`}
                  className="group block"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-pink-300 hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                    {/* Compact Product Layout */}
                    <div className="flex items-start space-x-3">
                      {/* Small Product Image */}
                      <div className="flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md border border-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">🖼️</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm text-gray-900 group-hover:text-pink-600 transition-colors truncate">
                            {product.name}
                          </h3>
                          {/* Stock Badge */}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                            product.stocks === 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.stocks <= 5 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stocks === 0 ? '0' : product.stocks}
                          </span>
                        </div>
                        
                        {/* Price */}
                        <div className="mt-1">
                          <span className="text-sm font-bold text-pink-600">
                            ₱{product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Hover Edit Indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            Edit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Show More Button */}
          {products.length > 8 && (
            <div className="mt-6 text-center">
              <Link
                to="/admin/products"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View All {products.length} Products
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 