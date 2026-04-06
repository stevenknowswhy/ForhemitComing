import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { isSuperAdmin } from '@/lib/clerk';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    const email = sessionClaims?.email as string | undefined;
    if (!isSuperAdmin(email)) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
    }

    // Get the clerk client instance
    const client = await clerkClient();

    // Get all users from Clerk
    const usersResponse = await client.users.getUserList({
      limit: 100,
    });

    const users = usersResponse.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: (user.publicMetadata?.role as string) || 'user',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      imageUrl: user.imageUrl,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
