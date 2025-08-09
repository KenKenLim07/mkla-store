"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthUser } from '@/types/db'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isProfileFetching = useRef(false)
  type ProfileCacheValue = { email?: string; role?: 'admin' | 'user'; full_name?: string }
  const profileCache = useRef<Map<string, ProfileCacheValue>>(new Map())

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          setError(error.message)
          return
        }
        if (session?.user) {
          setUser({ id: session.user.id, email: undefined, role: 'user', full_name: undefined })
          if (!isProfileFetching.current) {
            isProfileFetching.current = true
            fetchUserProfile(session.user.id)
          }
        } else {
          setProfileLoaded(true)
        }
      } catch {
        setError('Failed to get session')
      } finally {
        setLoading(false)
      }
    }
    getInitialSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({ id: session.user.id, email: undefined, role: 'user', full_name: undefined })
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
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      if (profileCache.current.has(userId)) {
        const cachedProfile = profileCache.current.get(userId)
        if (cachedProfile) {
          setUser(prev => prev ? ({ ...prev, email: cachedProfile.email, role: cachedProfile.role || 'user', full_name: cachedProfile.full_name }) : null)
          setProfileLoaded(true)
          return
        }
        setProfileLoaded(true)
        return
      }
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) {
        setProfileLoaded(true)
        return
      }
      if (data) {
        profileCache.current.set(userId, data)
        setUser(prev => prev ? ({ ...prev, email: data.email, role: data.role || 'user', full_name: data.full_name }) : null)
        setProfileLoaded(true)
      } else {
        setProfileLoaded(true)
      }
    } catch {
      setProfileLoaded(true)
    } finally {
      isProfileFetching.current = false
    }
  }

  const signIn = async ({ email, password }: { email: string, password: string }) => supabase.auth.signInWithPassword({ email, password })
  const signUp = async ({ email, password, fullName }: { email: string, password: string, fullName: string }) => supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  const signOut = async () => supabase.auth.signOut()
  const refreshProfile = async () => { if (user?.id) { isProfileFetching.current = false; await fetchUserProfile(user.id) } }

  return { user, loading, profileLoaded, error, signIn, signUp, signOut, refreshProfile }
}
 