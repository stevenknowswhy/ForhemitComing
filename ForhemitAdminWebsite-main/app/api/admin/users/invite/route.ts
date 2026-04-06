import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { isSuperAdmin, isAllowedEmail } from '@/lib/clerk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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

    const { email: inviteEmail } = await req.json();

    if (!inviteEmail || !isAllowedEmail(inviteEmail)) {
      return NextResponse.json(
        { error: 'Invalid email. Only @forhemit.com addresses are allowed.' },
        { status: 400 }
      );
    }

    // Get the clerk client instance
    const client = await clerkClient();

    // Create invitation
    const invitation = await client.invitations.createInvitation({
      emailAddress: inviteEmail,
      publicMetadata: {
        role: 'admin',
        invitedBy: userId,
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5050'}/admin`,
    });

    return NextResponse.json({ 
      success: true, 
      invitationId: invitation.id,
      message: `Invitation sent to ${inviteEmail}`
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    );
  }
}
