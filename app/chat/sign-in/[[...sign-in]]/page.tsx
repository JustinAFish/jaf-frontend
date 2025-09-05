'use client'
import { Suspense } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { Loading } from '@/components/ui/loading'

function SignInContent() {
  return <AuthPage mode="signin" />
}

export default function SignIn() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInContent />
    </Suspense>
  )
} 