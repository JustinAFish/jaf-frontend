import React from 'react'

interface LoadingProps {
  message?: string
  subMessage?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ 
  message = "Loading...", 
  subMessage,
  size = 'md',
  className = ""
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={`mt-24 p-6 flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <div className="text-white mb-4">{message}</div>
      <div className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}></div>
      {subMessage && (
        <p className="text-gray-400 text-sm mt-4">{subMessage}</p>
      )}
    </div>
  )
}

// Compact loading spinner for inline use
export function LoadingSpinner({ size = 'sm', className = "" }: Pick<LoadingProps, 'size' | 'className'>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]} ${className}`}></div>
  )
} 