import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      version: '0.1.0',
      endpoints: [
        {
          path: '/api/health',
          method: 'GET',
          description: 'Health check endpoint',
          contentType: 'application/json',
        },
      ],
      links: [],
    },
    {
      status: 200,
      headers: { 'Content-Type': 'application/linkset+json' },
    },
  )
}
