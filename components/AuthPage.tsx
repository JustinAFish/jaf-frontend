import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loading } from '@/components/ui/loading'

interface AuthPageProps {
  mode: 'signin' | 'signup'
}

export function AuthPage({ mode }: AuthPageProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading, signIn } = useAuth()
  const redirectUrl = searchParams.get('redirect_url')

  useEffect(() => {
    let mounted = true

    const handleAuthFlow = async () => {
      // If user is already authenticated, redirect them
      if (isAuthenticated && !isLoading) {
        const destination = redirectUrl || '/chat'
        
        // Use Next.js router for internal navigation
        if (destination.startsWith('/')) {
          router.push(destination)
        } else if (destination.startsWith('https://main.d325l4yh4si1cx.amplifyapp.com')) {
          // Extract the path from the full URL
          const url = new URL(destination)
          router.push(url.pathname + url.search)
        } else {
          router.push('/chat')
        }
        return
      }

      // Check if this is an OAuth callback
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('code')) {
        console.log('OAuth callback detected, redirecting to callback page')
        router.push(`/chat/callback${window.location.search}`)
        return
      }

      if (mounted) {
        setIsInitializing(false)
      }
    }

    // Wait for auth hook to finish loading before proceeding
    if (!isLoading) {
      handleAuthFlow()
    }

    return () => {
      mounted = false
    }
  }, [isAuthenticated, isLoading, redirectUrl, router])

  // Show loading while initializing or while auth hook is loading
  if (isInitializing || isLoading) {
    return <Loading />
  }

  const isSignUp = mode === 'signup'
  
  return (
    <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          {isSignUp 
            ? 'Create an account to access the chat interface'
            : 'Sign in to access the chat interface'
          }
        </p>
        <button
          onClick={signIn}
          className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 ${
            isSignUp 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'} with AWS Cognito
        </button>
        
        {isSignUp && (
          <p className="text-gray-400 text-center mt-4">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/chat/sign-in')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>
    </div>
  )
} 