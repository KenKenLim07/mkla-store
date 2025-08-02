import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { AuthUser } from '../types/db'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isProfileFetching = useRef(false)
  const profileCache = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
          return
        }

        if (session?.user) {
          // Set basic user immediately for fast loading
          setUser({
            id: session.user.id,
            email: undefined,
            role: 'user',
            full_name: undefined
          })
          
          // Fetch profile in background (non-blocking)
          if (!isProfileFetching.current) {
            isProfileFetching.current = true
            fetchUserProfile(session.user.id)
          }
        } else {
          setProfileLoaded(true) // No user, so profile is "loaded"
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Failed to get session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: undefined,
            role: 'user',
            full_name: undefined
          })
          
          // Reset profile loaded state for new user
          setProfileLoaded(false)
          
          if (!isProfileFetching.current) {
            isProfileFetching.current = true
            fetchUserProfile(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setError(null)
          setProfileLoaded(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check cache first
      if (profileCache.current.has(userId)) {
        const cachedProfile = profileCache.current.get(userId)
        console.log('fetchUserProfile: Using cached profile for user:', userId)
        
        setUser(prev => {
          if (!prev) return null
          const updatedUser = {
            ...prev,
            email: cachedProfile.email,
            role: cachedProfile.role || 'user',
            full_name: cachedProfile.full_name
          }
          console.log('fetchUserProfile: Updated user from cache:', updatedUser)
          return updatedUser
        })
        
        setProfileLoaded(true)
        return
      }

      console.log('fetchUserProfile: Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('fetchUserProfile: Database response:', { data, error })

      if (error) {
        console.error('Error fetching profile:', error)
        // Don't set error here - user can still use the app with basic info
        setProfileLoaded(true)
        return
      }

      if (data) {
        // Cache the profile data
        profileCache.current.set(userId, data)
        
        console.log('fetchUserProfile: Updating user with profile data:', {
          email: data.email,
          role: data.role,
          full_name: data.full_name
        })
        
        setUser(prev => {
          if (!prev) return null
          const updatedUser = {
            ...prev,
            email: data.email,
            role: data.role || 'user',
            full_name: data.full_name
          }
          console.log('fetchUserProfile: Updated user state:', updatedUser)
          return updatedUser
        })
        
        setProfileLoaded(true)
        console.log('fetchUserProfile: Profile loaded successfully')
      } else {
        console.log('fetchUserProfile: No profile data found for user:', userId)
        setProfileLoaded(true)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setProfileLoaded(true)
    } finally {
      isProfileFetching.current = false
    }
  }

  const signIn = async ({ email, password }: { email: string, password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async ({ email, password, fullName }: { email: string, password: string, fullName: string }) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      console.log('refreshProfile: Manually refreshing profile for user:', user.id)
      isProfileFetching.current = false
      await fetchUserProfile(user.id)
    }
  }

  return {
    user,
    loading,
    profileLoaded,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile
  }
} 