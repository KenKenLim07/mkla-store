import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.JSX.Element
  adminOnly?: boolean
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, profileLoaded } = useAuth()

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    user: user,
    loading: loading,
    profileLoaded: profileLoaded,
    adminOnly: adminOnly,
    userRole: user?.role,
    userId: user?.id
  })

  // Show loading skeleton while auth is being determined
  if (loading) {
    console.log('ProtectedRoute: Loading... (auth)')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // For admin routes, wait for profile to be loaded to get accurate role
  if (adminOnly && !profileLoaded) {
    console.log('ProtectedRoute: Waiting for profile to load...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check admin role if required
  if (adminOnly && user.role !== 'admin') {
    console.log('ProtectedRoute: Not admin, redirecting to home. User role:', user.role)
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: Access granted, rendering children')
  return children
} 