import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY_EXISTS: !!process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    EMAIL_USER_EXISTS: !!process.env.EMAIL_USER,
    EMAIL_PASSWORD_EXISTS: !!process.env.EMAIL_PASSWORD,
    ALL_CLERK_VARS: Object.keys(process.env).filter(key => key.includes('CLERK')),
    ALL_EMAIL_VARS: Object.keys(process.env).filter(key => key.includes('EMAIL')),
    RUNTIME: process.env.AWS_EXECUTION_ENV || 'unknown',
    ALL_ENV_KEYS: Object.keys(process.env).length,
  };

  return NextResponse.json(envVars);
} 