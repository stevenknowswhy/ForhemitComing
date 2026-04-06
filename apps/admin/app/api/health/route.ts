import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  }

  const convexUrl = env.NEXT_PUBLIC_CONVEX_URL
  const convexConfigured = convexUrl !== 'https://dummy.convex.cloud'
  if (process.env.NODE_ENV === 'production' && !convexConfigured) {
    return NextResponse.json(
      {
        ...checks,
        status: 'unhealthy',
        error: 'Convex URL not configured for production',
      },
      { status: 503 },
    )
  }

  return NextResponse.json(
    { ...checks, convexConfigured },
    { status: 200 },
  )
}
