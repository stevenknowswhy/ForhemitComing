import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      resource: 'https://forhemit.com',
      authorization_servers: [],
      scopes_supported: [],
      bearer_methods_supported: [],
    },
    { status: 200 },
  )
}
