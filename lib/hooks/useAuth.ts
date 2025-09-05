import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, signOut, signInWithRedirect, fetchAuthSession } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { Hub } from 'aws-amplify/utils'

interface AuthUser {
  username: string
  email?: string
  attributes?: Record<string, unknown>
}

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    console.log('[useAuth] Checking authentication...')
    try {
      // First check if we have a valid session
      const session = await fetchAuthSession()
      console.log('[useAuth] Session check:', { 
        isValid: !!session?.tokens?.accessToken,
        hasTokens: !!session?.tokens 
      })

      if (!session?.tokens?.accessToken) {
        console.log('[useAuth] No valid session found')
        setUser(null)
        setIsLoading(false)
        return
      }

      // If we have a valid session, get user details
      const currentUser = await getCurrentUser()
      console.log('[useAuth] User found:', currentUser)
      
      // Extract user information
      const userObj = currentUser as {
        signInDetails?: { loginId?: string }
        username?: string
        attributes?: { email?: string; [key: string]: unknown }
      }
      const username = userObj?.signInDetails?.loginId || 
                      userObj?.username || 
                      userObj?.attributes?.email || 
                      'User'
      
      const userData = {
        username,
        email: userObj?.attributes?.email,
        attributes: userObj?.attributes
      }
      
      console.log('[useAuth] Setting user data:', userData)
      setUser(userData)
      setIsLoading(false)
    } catch (error) {
      console.log('[useAuth] Authentication check failed:', error)
      setUser(null)
      setIsLoading(false)
    }
  }, [])

  const handleSignIn = useCallback(async () => {
    try {
      console.log('[useAuth] Initiating sign-in...')
      setIsLoading(true)
      await signInWithRedirect()
    } catch (error) {
      console.error('[useAuth] Error signing in:', error)
      setIsLoading(false)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      console.log('[useAuth] Signing out...')
      await signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('[useAuth] Error signing out:', error)
    }
  }, [router])

  // Set up Hub listener for auth events
  useEffect(() => {
    console.log('[useAuth] Setting up Hub listener')
    const hubUnsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('[useAuth] Auth event received:', payload.event)
      
      switch (payload.event) {
        case 'signedIn':
          console.log('[useAuth] User signed in, checking auth')
          checkAuth()
          break
        case 'signedOut':
          console.log('[useAuth] User signed out')
          setUser(null)
          setIsLoading(false)
          break
        case 'tokenRefresh':
          console.log('[useAuth] Token refreshed successfully')
          // Token refreshed, user is still authenticated
          break
        case 'tokenRefresh_failure':
          console.log('[useAuth] Token refresh failed, clearing user')
          // Token refresh failed, user might need to re-authenticate
          setUser(null)
          setIsLoading(false)
          break
      }
    })

    // Initial auth check
    console.log('[useAuth] Performing initial auth check')
    checkAuth()

    return () => {
      console.log('[useAuth] Cleaning up Hub listener')
      hubUnsubscribe()
    }
  }, [checkAuth])

  const isAuthenticated = !!user
  console.log('[useAuth] Current state:', { user: !!user, isLoading, isAuthenticated })

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkAuth
  }
} 