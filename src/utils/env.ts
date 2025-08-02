// env.ts - Environment validation utilities

interface EnvironmentConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  isDevelopment: boolean
  isProduction: boolean
}

/**
 * Validates required environment variables
 */
const validateEnvironment = (): EnvironmentConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const mode = import.meta.env.MODE

  const errors: string[] = []

  // Check required variables
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is required')
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must be a valid HTTPS URL')
  }

  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required')
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)')
  }

  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.join('\n')}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    isDevelopment: mode === 'development',
    isProduction: mode === 'production',
  }
}

// Validate environment on module load
export const env = validateEnvironment()

// Additional environment checks for production
if (env.isProduction) {
  // Warn about development settings in production
  if (env.supabaseUrl.includes('localhost') || env.supabaseUrl.includes('127.0.0.1')) {
    console.warn('Warning: Using localhost Supabase URL in production')
  }
}

/**
 * Gets the appropriate base URL for the current environment
 */
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for server-side rendering or build time
  if (env.isProduction) {
    return 'https://your-domain.com' // Replace with actual production domain
  }
  
  return 'http://localhost:5173'
}

/**
 * Feature flags based on environment
 */
export const features = {
  enableAnalytics: env.isProduction,
  enableErrorReporting: env.isProduction,
  enablePerformanceMonitoring: env.isProduction,
  enableDebugLogs: env.isDevelopment,
} as const