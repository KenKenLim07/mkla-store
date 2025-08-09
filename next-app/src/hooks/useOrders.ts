"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface OrderWithProduct {
  id: string
  user_id: string
  product_id?: string
  buyer_name: string
  payment_proof_url?: string
  status?: string
  denial_reason?: string
  created_at?: string
  product: {
    id: string
    name: string
    description?: string
    price: number
    image_url?: string
    stocks: number
  } | null
}

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, product:products(id, name, description, price, image_url, stocks)`) 
        .order('created_at', { ascending: false })
      if (error) {
        setError(error.message)
        setOrders([])
      } else {
        setOrders((data || []) as unknown as OrderWithProduct[])
      }
    } catch {
      setError('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  return { orders, loading, error, refetch: fetchOrders }
} 