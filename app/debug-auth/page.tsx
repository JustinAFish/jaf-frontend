'use client'
import React from 'react'
import { signOut } from 'aws-amplify/auth'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DebugAuthPage() {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuth()

  const handleClearAuth = async () => {
    try {
      await signOut()
      // Clear any localStorage data
      localStorage.clear()
      // Clear sessionStorage
      sessionStorage.clear()
      console.log('Cleared all auth data')
      window.location.reload()
    } catch (error) {
      console.error('Error clearing auth:', error)
    }
  }

  const handleForceCheck = () => {
    checkAuth()
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Authentication Debug</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Auth State</h2>
          <div className="space-y-2 text-gray-300">
            <div>Loading: <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>{isLoading ? 'Yes' : 'No'}</span></div>
            <div>Authenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{isAuthenticated ? 'Yes' : 'No'}</span></div>
            <div>User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Present' : 'None'}</span></div>
            {user && (
              <div className="ml-4 mt-2">
                <div>Username: {user.username}</div>
                <div>Email: {user.email || 'N/A'}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleForceCheck}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Force Auth Check
            </button>
            <button
              onClick={handleClearAuth}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg ml-4"
            >
              Clear All Auth Data
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-gray-300 space-y-2">
            <p>1. Check the current authentication state above</p>
            <p>2. If you&apos;re incorrectly shown as authenticated, click &quot;Clear All Auth Data&quot;</p>
            <p>3. After clearing, try accessing /chat again</p>
            <p>4. Check browser console for detailed authentication logs</p>
          </div>
        </div>
      </div>
    </div>
  )
} 