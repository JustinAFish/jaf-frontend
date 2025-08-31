'use client'

import React, { useEffect } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, type ResourcesConfig } from 'aws-amplify'

const rawDomain = process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || ''
const domain = rawDomain.startsWith('http') ? rawDomain.replace(/^https?:\/\//, '') : rawDomain

const amplifyConfigBase = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
}

const oauth = domain
  ? {
      domain,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT,
      responseType: 'code',
    }
  : undefined

const amplifyConfig = {
  Auth: {
    ...amplifyConfigBase,
    ...(oauth ? { oauth } : {}),
  },
}

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[Amplify] rawDomain=', rawDomain)
    console.log('[Amplify] normalized domain=', domain)
    console.log('[Amplify] auth config=', {
      region: amplifyConfigBase.region,
      userPoolId: amplifyConfigBase.userPoolId,
      userPoolWebClientId: amplifyConfigBase.userPoolWebClientId,
      oauth: oauth ?? '(no oauth)'
    })
    Amplify.configure({ Auth: amplifyConfig.Auth } as unknown as ResourcesConfig)
  }, [])

  return <>{children}</>
} 