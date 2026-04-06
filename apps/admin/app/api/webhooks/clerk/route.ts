import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { isAllowedEmail, isSuperAdmin, SUPER_ADMIN_EMAIL } from '@/lib/clerk';

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;
  
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, primary_email_address_id } = evt.data;
    
    // Get the primary email
    const primaryEmail = email_addresses?.find(
      email => email.id === primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      console.log('No primary email found for user:', id);
      return new Response('No email found', { status: 200 });
    }

    // Check if email is from allowed domain
    if (!isAllowedEmail(primaryEmail)) {
      console.log('User with non-allowed email attempted sign-up:', primaryEmail);
      // Get clerk client and delete the user
      try {
        const client = await clerkClient();
        await client.users.deleteUser(id);
        console.log('Deleted user with unauthorized email:', primaryEmail);
      } catch (error) {
        console.error('Failed to delete unauthorized user:', error);
      }
      return new Response('Email domain not allowed', { status: 403 });
    }

    // Get clerk client for updates
    const client = await clerkClient();

    // If this is the super admin, assign the super-admin role
    if (isSuperAdmin(primaryEmail)) {
      try {
        await client.users.updateUser(id, {
          publicMetadata: {
            role: 'super-admin',
            isAdmin: true,
          },
        });
        console.log('Assigned super-admin role to:', primaryEmail);
      } catch (error) {
        console.error('Failed to assign super-admin role:', error);
      }
    } else {
      // Regular forhemit.com user - assign admin role
      try {
        await client.users.updateUser(id, {
          publicMetadata: {
            role: 'admin',
            isAdmin: true,
          },
        });
        console.log('Assigned admin role to:', primaryEmail);
      } catch (error) {
        console.error('Failed to assign admin role:', error);
      }
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
