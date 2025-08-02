import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Product, SupabaseResponse } from '../types/db'
import { logger } from '../utils/logger'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loading: authLoading } = useAuth()
  const hasFetched = useRef(false)

  const fetchProducts = async () => {
    if (hasFetched.current) return
    
    try {
      setLoading(true)
      setError(null)
      hasFetched.current = true
      
      const { data, error }: SupabaseResponse<Product[]> = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logger.apiError('products', error)
        setError(error.message)
        return
      }

      setProducts(data || [])
    } catch (err) {
      logger.error('Failed to fetch products', err as Error)
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Start fetching products immediately - don't wait for auth
    fetchProducts()
  }, []) // Remove authLoading dependency

  return {
    products,
    loading, // Only show products loading, not auth loading
    error,
    refetch: () => {
      hasFetched.current = false
      fetchProducts()
    }
  }
} 