import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/ui/Navbar'
import { Home } from './pages/Home'
import { PageLoader } from './components/ui/Loader'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ProtectedRoute } from './routes/ProtectedRoute'

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })))
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })))
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })))
const PaymentQR = lazy(() => import('./pages/PaymentQR').then(module => ({ default: module.PaymentQR })))
const Orders = lazy(() => import('./pages/Orders').then(module => ({ default: module.Orders })))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
const ManageProducts = lazy(() => import('./pages/ManageProducts').then(module => ({ default: module.ManageProducts })))
const AdminAddProduct = lazy(() => import('./pages/AdminAddProduct').then(module => ({ default: module.AdminAddProduct })))
const AdminOrders = lazy(() => import('./pages/AdminOrders').then(module => ({ default: module.AdminOrders })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment" element={<PaymentQR />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
                <Route path="/admin/products/new" element={<ProtectedRoute adminOnly><AdminAddProduct /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
