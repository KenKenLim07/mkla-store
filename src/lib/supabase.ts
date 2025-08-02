// supabase.ts - Supabase client configuration
import { createClient } from '@supabase/supabase-js'
import { env } from '../utils/env'

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    // Only enable realtime in production if needed
    params: {
      eventsPerSecond: env.isProduction ? 10 : 2,
    },
  },
}) 
