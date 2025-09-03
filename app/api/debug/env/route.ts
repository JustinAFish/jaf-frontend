import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    AWS_COGNITO_USER_POOL_ID_EXISTS: !!process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    AWS_COGNITO_APP_CLIENT_ID_EXISTS: !!process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
    AWS_COGNITO_DOMAIN_EXISTS: !!process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
    EMAIL_USER_EXISTS: !!process.env.EMAIL_USER,
    EMAIL_PASSWORD_EXISTS: !!process.env.EMAIL_PASSWORD,
    ALL_COGNITO_VARS: Object.keys(process.env).filter(key => key.includes('COGNITO')),
    ALL_EMAIL_VARS: Object.keys(process.env).filter(key => key.includes('EMAIL')),
    RUNTIME: process.env.AWS_EXECUTION_ENV || 'unknown',
    ALL_ENV_KEYS: Object.keys(process.env).length,
  };

  return NextResponse.json(envVars);
} 