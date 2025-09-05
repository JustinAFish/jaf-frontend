import React from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export function AuthDebug() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div>Loading: {isLoading ? '✅' : '❌'}</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>User: {user ? '✅' : '❌'}</div>
      {user && (
        <div className="mt-2">
          <div>Username: {user.username}</div>
          <div>Email: {user.email || 'N/A'}</div>
        </div>
      )}
      <div className="mt-2 text-gray-400">
        Check browser console for detailed logs
      </div>
    </div>
  )
} 