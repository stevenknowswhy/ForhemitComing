import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { isSuperAdmin } from '@/lib/clerk';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: targetUserId } = await params;

    // Don't allow deleting yourself
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get the clerk client instance
    const client = await clerkClient();

    // Get target user to check if they're super admin
    const targetUser = await client.users.getUser(targetUserId);
    const targetRole = targetUser.publicMetadata?.role as string;

    if (targetRole === 'super-admin') {
      return NextResponse.json(
        { error: 'Cannot delete super admin accounts' },
        { status: 400 }
      );
    }

    // Delete the user
    await client.users.deleteUser(targetUserId);

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
