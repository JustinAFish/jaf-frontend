'use client'
import { Suspense } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { Loading } from '@/components/ui/loading'

function SignUpContent() {
  return <AuthPage mode="signup" />
}

export default function SignUp() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpContent />
    </Suspense>
  )
} 