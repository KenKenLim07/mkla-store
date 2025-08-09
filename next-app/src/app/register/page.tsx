"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

// metadata removed because this is a client component

export default function Page() {
  const router = useRouter()
  const { user, signUp } = useAuth()
  const [formData, setFormData] = useState<FormData>({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [containerHeight, setContainerHeight] = useState('100vh')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateHeight = () => {
      const navbarHeight = 64
      const availableHeight = window.innerHeight - navbarHeight
      setContainerHeight(`${availableHeight}px`)
    }
    calculateHeight()
    window.addEventListener('resize', calculateHeight)
    window.addEventListener('orientationchange', calculateHeight)
    return () => {
      window.removeEventListener('resize', calculateHeight)
      window.removeEventListener('orientationchange', calculateHeight)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') router.replace('/admin')
    else router.replace('/')
  }, [user, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setErrors({})
    try {
      const { error } = await signUp({ email: formData.email, password: formData.password, fullName: formData.fullName })
      if (error) {
        setErrors({ general: error.message || 'Failed to register' })
        return
      }
      alert('Registration successful! Please check your email to verify your account.')
      router.push('/login')
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ height: containerHeight }}
    >
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join MKLA Creations and start shopping!</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.fullName && (<p className="mt-1 text-sm text-red-600">{errors.fullName}</p>)}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
              </button>
            </div>
            {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password}</p>)}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
              </button>
            </div>
            {errors.confirmPassword && (<p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>)}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 