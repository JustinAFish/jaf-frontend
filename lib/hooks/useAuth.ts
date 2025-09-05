import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, signOut, signInWithRedirect } from 'aws-amplify/auth'
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
    try {
      const currentUser = await getCurrentUser()
      
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
      
      setUser({
        username,
        email: userObj?.attributes?.email,
        attributes: userObj?.attributes
      })
      setIsLoading(false)
    } catch {
      setUser(null)
      setIsLoading(false)
    }
  }, [])

  const handleSignIn = useCallback(async () => {
    try {
      setIsLoading(true)
      await signInWithRedirect()
    } catch (error) {
      console.error('Error signing in:', error)
      setIsLoading(false)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [router])

  // Set up Hub listener for auth events
  useEffect(() => {
    const hubUnsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('[useAuth] Auth event:', payload.event)
      
      switch (payload.event) {
        case 'signedIn':
          checkAuth()
          break
        case 'signedOut':
          setUser(null)
          break
        case 'tokenRefresh':
          // Token refreshed, user is still authenticated
          break
        case 'tokenRefresh_failure':
          // Token refresh failed, user might need to re-authenticate
          setUser(null)
          break
      }
    })

    // Initial auth check
    checkAuth()

    return () => {
      hubUnsubscribe()
    }
  }, [checkAuth])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkAuth
  }
} 