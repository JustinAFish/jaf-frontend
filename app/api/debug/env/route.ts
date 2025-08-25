import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY_EXISTS: !!process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    ALL_CLERK_VARS: Object.keys(process.env).filter(key => key.includes('CLERK')),
    RUNTIME: process.env.AWS_EXECUTION_ENV || 'unknown',
  };

  return NextResponse.json(envVars);
} 