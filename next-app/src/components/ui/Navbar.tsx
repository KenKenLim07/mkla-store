"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from 'react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

const NavbarSkeleton = () => (
  <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
      <div className="w-32 h-6 bg-gray-200 rounded mr-4" />
      <div className="w-16 h-6 bg-gray-200 rounded mr-2" />
      <div className="w-16 h-6 bg-gray-200 rounded" />
    </div>
  </nav>
)

export const Navbar = () => {
  const { user, loading, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const adminDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isAdminDropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(e.target as Node)) {
        setIsAdminDropdownOpen(false)
      }
    }
    function handleEsc(e: KeyboardEvent) { if (e.key === 'Escape') setIsAdminDropdownOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isAdminDropdownOpen])

  if (loading) return <NavbarSkeleton />

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-none border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-xl font-bold text-pink-600 hover:text-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg p-2 hover:bg-pink-50 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🛍️</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-pink-600">MKLA</span>
                <span className="text-pink-500 italic font-medium text-sm">Creations</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-1 ml-10">
              <Link href="/" className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 relative group">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-pink-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              </Link>
              {user && (
                <Link href="/orders" className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 relative group">
                  <span className="relative z-10">My Orders</span>
                  <div className="absolute inset-0 bg-pink-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                </Link>
              )}
              {user?.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex items-center space-x-1 relative group"
                    aria-expanded={isAdminDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="relative z-10">Admin</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                    <div className="absolute inset-0 bg-pink-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                  </button>
                  <div
                    ref={adminDropdownRef}
                    className={`absolute top-full right-0 z-50 w-56 transition-all duration-300 ease-out ${isAdminDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'} bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 py-2 mt-2`}
                    tabIndex={-1}
                    aria-label="Admin menu"
                  >
                    <Link href="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 rounded-lg mx-2" onClick={() => setIsAdminDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/admin/products" className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 rounded-lg mx-2" onClick={() => setIsAdminDropdownOpen(false)}>
                      Manage Products
                    </Link>
                  </div>
                  {isAdminDropdownOpen && (<div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setIsAdminDropdownOpen(false)} />)}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                  Hello, {user.full_name || 'User'}! 👋
                </span>
                <button onClick={handleSignOut} className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 relative group">
                  <span className="relative z-10">Sign Out</span>
                  <div className="absolute inset-0 bg-pink-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 relative group">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-pink-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-pink-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 hover:bg-pink-50" aria-expanded={isMobileMenuOpen} aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6 transition-transform duration-300 rotate-90" /> : <Bars3Icon className="h-6 w-6 transition-transform duration-300" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-700 hover:text-pink-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-700 hover:text-pink-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50" onClick={() => setIsMobileMenuOpen(false)}>
                My Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <>
                <Link href="/admin" className="text-gray-700 hover:text-pink-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-gray-700 hover:text-pink-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Manage Products
                </Link>
              </>
            )}
            <div className="border-t border-gray-100 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">Hello, {user.full_name || 'User'}! 👋</div>
                  <button onClick={handleSignOut} className="text-gray-700 hover:text-pink-600 block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-pink-600 block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pink-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 