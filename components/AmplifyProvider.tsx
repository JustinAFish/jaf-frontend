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

// const amplifyConfig = {
//   Auth: {
//     ...amplifyConfigBase,
//     ...(oauth ? { oauth } : {}),
//   },
// }

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const finalAuth = {
    ...amplifyConfigBase,
    ...(oauth ? { oauth } : {}),
    Cognito: oauth ? { loginWith: { oauth } } : undefined,
  }

  // debug
  console.log('[Amplify] finalAuth', finalAuth)

  // runtime env checks - warn if required NEXT_PUBLIC_ vars are missing
  const missingVars: string[] = []
  if (!process.env.NEXT_PUBLIC_AWS_REGION) missingVars.push('NEXT_PUBLIC_AWS_REGION')
  if (!process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID) missingVars.push('NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID')
  if (!process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID) missingVars.push('NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID')
  if (oauth && !process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN) missingVars.push('NEXT_PUBLIC_AWS_COGNITO_DOMAIN')

  if (missingVars.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('[Amplify] Missing required NEXT_PUBLIC_ env vars:', missingVars.join(', '))
  }

  Amplify.configure({ Auth: finalAuth } as unknown as ResourcesConfig)

  useEffect(() => {
    // log current runtime config once
    console.log('[Amplify] getConfig', Amplify.getConfig())
  }, [])

  return <>{children}</>
} 