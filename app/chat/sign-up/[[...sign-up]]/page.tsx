'use client'
import { useEffect, useState } from 'react'
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is already authenticated
        await getCurrentUser()
        // If authenticated, redirect to chat
        router.push('/chat')
        return
      } catch {
        // User not authenticated, proceed with sign up
        console.log('User not authenticated, showing sign up')
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
          router.push('/chat')
          return
        } catch {
          console.error('Error processing OAuth callback')
          setIsLoading(false)
        }
      } else {
        // Not a callback, show sign up button
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, [router])

  const handleSignUp = async () => {
    try {
      setIsLoading(true)
      // Use signInWithRedirect but direct to sign-up flow
      await signInWithRedirect()
    } catch {
      console.error('Error signing up')
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
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h1>
        <p className="text-gray-300 mb-6 text-center">
          Create an account to access the chat interface
        </p>
        <button
          onClick={handleSignUp}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Sign Up with AWS Cognito
        </button>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{' '}
          <a href="/chat/sign-in" className="text-blue-400 hover:text-blue-300">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
} 