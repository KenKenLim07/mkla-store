"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/db'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchProducts = async () => {
    if (hasFetched.current) return
    try {
      setLoading(true)
      setError(null)
      hasFetched.current = true
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        setError(error.message)
        return
      }
      setProducts(data || [])
    } catch {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  return { products, loading, error, refetch: () => { hasFetched.current = false; fetchProducts() } }
} 