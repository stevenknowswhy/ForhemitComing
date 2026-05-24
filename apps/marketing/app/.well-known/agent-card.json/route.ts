import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      name: 'Forhemit',
      description: 'Founder succession through employee ownership, with ESOP structuring and post-close stewardship support.',
      url: 'https://forhemit.com',
      version: '0.1.0',
      capabilities: [],
      authentication: [],
      skills: [],
    },
    { status: 200 },
  )
}
