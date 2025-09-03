'use client'
import { useEffect, useState, Suspense } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we have an authorization code
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          setStatus('error')
          return
        }

        if (code) {
          // Wait for Amplify to process the OAuth callback
          let attempts = 0
          const maxAttempts = 10
          
          while (attempts < maxAttempts) {
            try {
              await getCurrentUser()
              setStatus('success')
              
              // Redirect to chat after successful authentication
              setTimeout(() => {
                router.push('/chat')
              }, 1000)
              return
            } catch {
              attempts++
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
          
          // If we get here, authentication failed
          console.error('Failed to authenticate after callback')
          setStatus('error')
        } else {
          // No code parameter, redirect to sign in
          router.push('/chat/sign-in')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        setStatus('error')
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (status === 'processing') {
    return (
      <div className="mt-24 p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-white mb-4">Processing authentication...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
          There was an error processing your authentication.
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