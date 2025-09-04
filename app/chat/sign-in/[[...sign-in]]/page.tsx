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
      console.log('[SignIn] Starting auth check, redirectUrl:', redirectUrl)
      
      try {
        // Check if user is already authenticated
        const user = await getCurrentUser()
        console.log('[SignIn] User is authenticated:', user)
        
        // If authenticated, redirect to intended page or chat
        const destination = redirectUrl || 'https://main.d325l4yh4si1cx.amplifyapp.com/chat'
        console.log('[SignIn] Redirecting authenticated user to:', destination)
        
        // Always use the destination as-is (it should be a full URL from middleware)
        window.location.href = destination
        return
      } catch {
        // User not authenticated, proceed with sign in
        console.log('[SignIn] User not authenticated, showing sign in form')
      }

      // Check if this is a callback from Cognito (has 'code' parameter)
      const urlParams = new URLSearchParams(window.location.search)
      const hasCode = urlParams.has('code')
      console.log('[SignIn] Has OAuth code:', hasCode)
      
      if (hasCode) {
        // This is a callback from Cognito, let Amplify handle it
        console.log('[SignIn] Processing OAuth callback')
        setIsLoading(true)
        try {
          // Wait a moment for Amplify to process the callback
          await new Promise(resolve => setTimeout(resolve, 2000))
          const user = await getCurrentUser()
          console.log('[SignIn] OAuth callback processed, user:', user)
          
          const destination = redirectUrl || 'https://main.d325l4yh4si1cx.amplifyapp.com/chat'
          console.log('[SignIn] Redirecting after OAuth to:', destination)
          window.location.href = destination
          return
        } catch (error) {
          console.error('[SignIn] Error processing OAuth callback:', error)
          setIsLoading(false)
        }
      } else {
        // Not a callback, show sign in button
        console.log('[SignIn] Not an OAuth callback, showing sign in button')
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, []) // Remove redirectUrl from dependencies to prevent infinite loops

  const handleSignIn = async () => {
    try {
      console.log('[SignIn] Starting sign in with redirect')
      setIsLoading(true)
      await signInWithRedirect()
    } catch (error) {
      console.error('[SignIn] Error signing in:', error)
      setIsLoading(false)
    }
  }

  console.log('[SignIn] Rendering, isLoading:', isLoading)

  if (isLoading) {
    return (
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Loading...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <div className="text-gray-400 text-sm mt-4">Checking authentication...</div>
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
        <div className="mt-4 text-xs text-gray-500 text-center">
          Debug: redirectUrl = {redirectUrl || 'none'}
        </div>
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