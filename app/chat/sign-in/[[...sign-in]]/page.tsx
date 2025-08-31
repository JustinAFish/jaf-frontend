'use client'

import { useCallback } from 'react'

export default function SignIn() {
  const openHostedUi = useCallback(async () => {
    try {
      const mod = (await import('aws-amplify')) as unknown as { Auth: { federatedSignIn: (opts?: Record<string, unknown>) => void } }
      mod.Auth.federatedSignIn({ provider: 'COGNITO' })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to open Hosted UI', err)
    }
  }, [])

  return (
    <div className="mt-24">
      <div className="max-w-md mx-auto bg-white p-8 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Sign in with Cognito</h2>
        <button
          className="w-full bg-teal-700 text-white py-3 rounded font-medium hover:opacity-95"
          onClick={openHostedUi}
        >
          Continue with Hosted UI
        </button>
        <p className="text-sm text-gray-500 mt-4">You will be redirected to the Cognito sign-in page.</p>
      </div>
    </div>
  )
} 