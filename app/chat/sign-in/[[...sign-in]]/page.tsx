'use client'
import { useEffect, useState, Suspense } from 'react'
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import { useSearchParams } from 'next/navigation'

function SignInContent() {
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url')

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Helper function to get the correct base URL
      const getBaseUrl = () => {
        // Detect production environment by checking the current domain
        const isProduction = window.location.hostname === 'main.d325l4yh4si1cx.amplifyapp.com'
        if (isProduction) {
          return 'https://main.d325l4yh4si1cx.amplifyapp.com'
        }
        return `${window.location.protocol}//${window.location.host}`
      }

      try {
        // Check if user is already authenticated
        await getCurrentUser()
        // If authenticated, redirect to intended page or chat
        const destination = redirectUrl || '/chat'
        if (destination.startsWith('/')) {
          // Use absolute URL for internal routes
          const baseUrl = getBaseUrl()
          window.location.href = `${baseUrl}${destination}`
        } else {
          // External URL, use as-is
          window.location.href = destination
        }
        return
      } catch {
        // User not authenticated, proceed with sign in
        console.log('User not authenticated, showing sign in')
      }

      // Check if this is a callback from Cognito (has 'code' parameter)
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('code')) {
        // This is a callback from Cognito, let Amplify handle it
        setIsLoading(true)
        try {
          // Wait a moment for Amplify to process the callback
          await new Promise(resolve => setTimeout(resolve, 1000))
          await getCurrentUser()
          const destination = redirectUrl || '/chat'
          if (destination.startsWith('/')) {
            // Use absolute URL for internal routes
            const baseUrl = getBaseUrl()
            window.location.href = `${baseUrl}${destination}`
          } else {
            // External URL, use as-is
            window.location.href = destination
          }
          return
        } catch {
          console.error('Error processing OAuth callback')
          setIsLoading(false)
        }
      } else {
        // Not a callback, show sign in button
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, [redirectUrl])

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithRedirect()
    } catch {
      console.error('Error signing in')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Loading...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <p className="text-gray-300 mb-6 text-center">
          Sign in to access the chat interface
        </p>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Sign In with AWS Cognito
        </button>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Loading...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
} 