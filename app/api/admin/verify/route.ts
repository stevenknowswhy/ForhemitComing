import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hasSession } from '../../../../lib/admin-session';

const ADMIN_COOKIE_NAME = 'admin_session';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken || !hasSession(sessionToken)) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json({ authenticated: true });
}
