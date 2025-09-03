'use client'

import React, { useEffect } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, type ResourcesConfig } from 'aws-amplify'

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID || '',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || '',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [
            process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || 'http://localhost:3000/chat'
          ],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT || 'http://localhost:3000'
          ],
          responseType: 'code' as const,
        },
      },
    },
  },
}

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify
    Amplify.configure(amplifyConfig)
    
    // Debug logging
    console.log('[Amplify] Configuration:', {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
      domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
      redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT,
    })
    console.log('[Amplify] getConfig:', Amplify.getConfig())
  }, [])

  return <>{children}</>
} 