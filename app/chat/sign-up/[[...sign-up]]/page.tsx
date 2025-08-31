'use client'
import { useEffect } from 'react'

export default function SignUp() {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || ''
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID || ''
    const redirect = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || ''
    const url = `${domain}/signup?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}`
    window.location.href = url
  }, [])

  return <div className="p-6"><p className="text-white">Redirecting to Hosted UI...</p></div>
} 