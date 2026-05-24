import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      issuer: 'https://forhemit.com',
      authorization_endpoint: '',
      token_endpoint: '',
      jwks_uri: '',
      response_types_supported: [],
      subject_types_supported: [],
      id_token_signing_alg_values_supported: [],
    },
    { status: 200 },
  )
}
