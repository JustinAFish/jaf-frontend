'use client'

import React, { useEffect } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, type ResourcesConfig } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
    oauth: {
      domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT,
      responseType: 'code'
    }
  }
}

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify on the client only
    Amplify.configure(amplifyConfig as unknown as ResourcesConfig)
  }, [])

  return <>{children}</>
} 