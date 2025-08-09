export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  stocks: number
  created_at?: string
}

export interface Order {
  id: string
  product_id?: string
  buyer_name: string
  payment_proof_url?: string
  status?: string
  denial_reason?: string
  created_at?: string
}

export type Role = 'admin' | 'user'

export interface Profile {
  id: string
  role?: Role
  full_name?: string
  created_at?: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  image_url?: string
  stocks: number
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  image_url?: string
  stocks?: number
}

export interface CreateOrderData {
  product_id: string
  buyer_name: string
  payment_proof_url?: string
  status?: string
}

export interface UpdateOrderData {
  buyer_name?: string
  payment_proof_url?: string
  status?: string
}

export interface CreateProfileData {
  role?: Role
  full_name?: string
}

export interface UpdateProfileData {
  role?: Role
  full_name?: string
}

export interface SupabaseResponse<T> {
  data: T | null
  error: unknown
}

export interface ProductFormData {
  name: string
  description: string
  price: string
  image?: File
}

export interface CheckoutFormData {
  buyer_name: string
  product_id: string
  payment_proof?: File
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface AuthUser {
  id: string
  email?: string
  role?: Role
  full_name?: string
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationState {
  page: number
  limit: number
  total: number
} 