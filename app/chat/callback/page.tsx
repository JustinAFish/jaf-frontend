'use client'
import { useEffect, useState, Suspense } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { useSearchParams, useRouter } from 'next/navigation'
import { Hub } from 'aws-amplify/utils'
import { Loading } from '@/components/ui/loading'

function AuthCallbackContent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [hasRedirected, setHasRedirected] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    let hubUnsubscribe: (() => void) | null = null

    const handleCallback = async () => {
      try {
        // Check if we have an authorization code
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        const state = searchParams.get('state')

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          if (mounted) setStatus('error')
          return
        }

        if (!code) {
          console.log('No authorization code found, redirecting to sign in')
          if (!hasRedirected) {
            setHasRedirected(true)
            router.push('/chat/sign-in')
          }
          return
        }

        console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...')
        
        // Extract redirect URL from state parameter or use default
        let redirectUrl = '/chat'
        try {
          if (state) {
            const decodedState = JSON.parse(atob(state))
            redirectUrl = decodedState.redirect_url || '/chat'
          }
        } catch {
          // If state parsing fails, use default
          console.log('Could not parse state parameter, using default redirect')
        }
        
        // Set up Hub listener for auth events
        hubUnsubscribe = Hub.listen('auth', ({ payload }) => {
          console.log('[Auth Hub Event]:', payload.event)
          
          if (!mounted || hasRedirected) return
          
          switch (payload.event) {
            case 'signInWithRedirect':
              console.log('OAuth sign-in process started')
              break
            case 'signInWithRedirect_failure':
              console.error('OAuth sign-in failed')
              setStatus('error')
              break
            case 'signedIn':
              console.log('User signed in successfully via OAuth')
              setStatus('success')
              // Redirect to intended destination after successful authentication
              setTimeout(() => {
                if (mounted && !hasRedirected) {
                  setHasRedirected(true)
                  // Use Next.js router for internal navigation
                  if (redirectUrl.startsWith('/')) {
                    router.push(redirectUrl)
                  } else {
                    router.push('/chat')
                  }
                }
              }, 1000)
              break
            case 'tokenRefresh_failure':
              console.error('Token refresh failed')
              setStatus('error')
              break
          }
        })

        // Check if user is already authenticated (in case Amplify processed the callback automatically)
        try {
          const user = await getCurrentUser()
          console.log('User already authenticated:', user)
          if (mounted && !hasRedirected) {
            setStatus('success')
            setTimeout(() => {
              if (mounted && !hasRedirected) {
                setHasRedirected(true)
                // Use Next.js router for internal navigation
                if (redirectUrl.startsWith('/')) {
                  router.push(redirectUrl)
                } else {
                  router.push('/chat')
                }
              }
            }, 1000)
          }
          return
        } catch {
          // User not authenticated yet, continue processing
          console.log('User not authenticated yet, waiting for OAuth processing...')
        }

        // Wait for Amplify to automatically process the OAuth callback
        // The Hub listener will handle the success/failure events
        
      } catch (error) {
        console.error('Error in auth callback:', error)
        if (mounted) setStatus('error')
      }
    }

    handleCallback()

    return () => {
      mounted = false
      if (hubUnsubscribe) {
        hubUnsubscribe()
      }
    }
  }, [searchParams, router, hasRedirected])

  if (status === 'processing') {
    return (
      <Loading 
        message="Processing authentication..." 
        subMessage="Exchanging authorization code for tokens..."
      />
    )
  }

  if (status === 'success') {
    return (
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-green-400 mb-4">✓ Authentication successful!</div>
        <div className="text-white">Redirecting to chat...</div>
      </div>
    )
  }

  return (
    <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-red-400 mb-4">❌ Authentication failed</div>
        <p className="text-gray-300 mb-6">
          There was an error processing your authentication. Please check the browser console for details.
        </p>
        <button
          onClick={() => router.push('/chat/sign-in')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackContent />
    </Suspense>
  )
} 