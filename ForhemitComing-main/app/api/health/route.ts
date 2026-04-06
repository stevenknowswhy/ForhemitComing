import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  }

  // Check Convex connection (optional - remove if not needed)
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) {
    return NextResponse.json(
      { ...checks, status: 'unhealthy', error: 'Missing Convex URL' },
      { status: 503 }
    )
  }

  return NextResponse.json(checks, { status: 200 })
}
