import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      name: 'Forhemit MCP',
      description: 'Forhemit website content and information for AI agents',
      version: '0.1.0',
      tools: [],
      server: {
        type: 'web',
        url: 'https://forhemit.com',
      },
    },
    { status: 200 },
  )
}
