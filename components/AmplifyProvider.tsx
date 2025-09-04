'use client'

import React, { useEffect } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, type ResourcesConfig } from 'aws-amplify'
import { Hub } from 'aws-amplify/utils'

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
            process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || 'https://main.d325l4yh4si1cx.amplifyapp.com/chat/callback',
          ],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT || 'https://main.d325l4yh4si1cx.amplifyapp.com/',
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
    
    // Set up global Hub listener for auth events
    const hubUnsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('[Global Auth Event]:', payload.event)
      
      switch (payload.event) {
        case 'signInWithRedirect':
          console.log('Sign in with redirect initiated')
          break
        case 'signInWithRedirect_failure':
          console.error('Sign in with redirect failed')
          break
        case 'signedIn':
          console.log('User signed in successfully')
          break
        case 'signedOut':
          console.log('User signed out')
          break
        case 'tokenRefresh':
          console.log('Token refreshed')
          break
        case 'tokenRefresh_failure':
          console.error('Token refresh failed')
          break
      }
    })
    
    // Check if this is an OAuth callback and process it
    const processOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const error = urlParams.get('error')
      
      if (error) {
        console.error('OAuth error in URL:', error, urlParams.get('error_description'))
        return
      }
      
      if (code && window.location.pathname === '/chat/callback') {
        console.log('[AmplifyProvider] Detected OAuth callback, processing...')
        
        // Amplify should automatically process this, but let's help it along
        try {
          // Import the auth module to trigger any automatic processing
          const { fetchAuthSession } = await import('aws-amplify/auth')
          await fetchAuthSession({ forceRefresh: true })
          console.log('[AmplifyProvider] OAuth callback processed successfully')
        } catch (error) {
          console.error('[AmplifyProvider] Error processing OAuth callback:', error)
        }
      }
    }
    
    // Process OAuth callback if present
    processOAuthCallback()
    
    // Debug logging
    console.log('[Amplify] Configuration:', {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
      domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
      redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT,
    })
    
    const config = Amplify.getConfig()
    console.log('[Amplify] Final config:', config)
    
    // Specifically log the OAuth configuration
    if (config.Auth?.Cognito?.loginWith?.oauth) {
      console.log('[Amplify] OAuth config:', config.Auth.Cognito.loginWith.oauth)
    }

    return () => {
      hubUnsubscribe()
    }
  }, [])

  return <>{children}</>
} 