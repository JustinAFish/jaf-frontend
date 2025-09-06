'use client'
import { useEffect, useState, Suspense } from 'react'
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import { useSearchParams } from 'next/navigation'

function SignInContent() {
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url')

  useEffect(() => {
    let mounted = true;
    
    const checkAuthAndRedirect = async () => {
      // Add a delay to let Amplify initialize and avoid race conditions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!mounted) return;
      
      try {
        // Check if user is already authenticated
        const user = await getCurrentUser()
        console.log('Sign-in page: User already authenticated:', user.username)
        
        // If authenticated, redirect to intended page or chat
        const destination = redirectUrl || '/chat'
        
        // Prevent redirect loops by checking referrer and adding delays
        const referrer = document.referrer
        console.log('Sign-in page: Referrer:', referrer)
        
        if (referrer.includes('/chat') || referrer.includes('/chat/callback')) {
          console.log('Sign-in page: Came from chat-related page, adding extra delay to prevent loop')
          // Add extra delay when coming from chat pages to prevent loops
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        if (!mounted) return;
        
        console.log('Sign-in page: Redirecting authenticated user to:', destination)
        
        // Handle both relative paths and full URLs
        if (destination.startsWith('https://main.d325l4yh4si1cx.amplifyapp.com')) {
          // Full production URL, use as-is
          window.location.href = destination
        } else if (destination.startsWith('/')) {
          // Relative path, make it absolute
          window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com${destination}`
        } else {
          // Other external URL, use as-is
          window.location.href = destination
        }
        return
      } catch (error) {
        // User not authenticated, proceed with sign in
        console.log('Sign-in page: User not authenticated, showing sign in:', error)
      }

      if (!mounted) return;

      // Check if this is a callback from Cognito (has 'code' parameter)
      // If so, redirect to the proper callback page to handle it
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('code')) {
        console.log('Sign-in page: OAuth callback detected, redirecting to callback page')
        // Redirect to callback page with all URL parameters preserved
        window.location.href = `https://main.d325l4yh4si1cx.amplifyapp.com/chat/callback${window.location.search}`
        return
      }

      // Not a callback and not authenticated, show sign in button
      if (mounted) {
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
    
    return () => {
      mounted = false;
    };
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