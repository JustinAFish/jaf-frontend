'use client'
import { useEffect, useState, Suspense } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { useSearchParams } from 'next/navigation'
import { Hub } from 'aws-amplify/utils'

function AuthCallbackContent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const searchParams = useSearchParams()

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
          console.log('No authorization code found, checking if user is already authenticated')
          // Check if user is already authenticated before redirecting
          try {
            await getCurrentUser()
            console.log('User already authenticated, redirecting to chat')
            if (mounted) {
              setStatus('success')
              setTimeout(() => {
                if (mounted) {
                  window.location.href = 'https://main.d325l4yh4si1cx.amplifyapp.com/chat'
                }
              }, 1000)
            }
            return
          } catch {
            // User not authenticated and no code, redirect to sign in
            console.log('User not authenticated, redirecting to sign in')
            window.location.href = 'https://main.d325l4yh4si1cx.amplifyapp.com/chat/sign-in'
            return
          }
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
          
          if (!mounted) return
          
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
                if (mounted) {
                  // Handle both relative paths and full URLs
                  if (redirectUrl.startsWith('https://main.d325l4yh4si1cx.amplifyapp.com')) {
                    window.location.href = redirectUrl
                  } else if (redirectUrl.startsWith('/')) {
                    window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com${redirectUrl}`
                  } else {
                    window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com/chat`
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
          if (mounted) {
            setStatus('success')
            setTimeout(() => {
              if (mounted) {
                // Handle both relative paths and full URLs
                if (redirectUrl.startsWith('https://main.d325l4yh4si1cx.amplifyapp.com')) {
                  window.location.href = redirectUrl
                } else if (redirectUrl.startsWith('/')) {
                  window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com${redirectUrl}`
                } else {
                  window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com/chat`
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
  }, [searchParams])

  if (status === 'processing') {
    return (
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Processing authentication...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-gray-400 text-sm mt-4">Exchanging authorization code for tokens...</p>
      </div>
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
          onClick={() => window.location.href = 'https://main.d325l4yh4si1cx.amplifyapp.com/chat/sign-in'}
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
    <Suspense fallback={
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Loading...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 