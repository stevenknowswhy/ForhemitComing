# User Management & Access Control

**Date**: 2026-03-22  
**Super Admin**: `stefano.stokes@forhemit.com`

---

## Email Domain Restrictions

### Allowed Domain
Only `@forhemit.com` email addresses can:
- Sign up for the admin panel
- Access admin routes
- Use the CRM system

### Configuration
This restriction is enforced at multiple levels:

1. **Middleware** (`middleware.ts`)
   - Checks email domain on every request
   - Rejects non-forhemit.com emails with 403 Forbidden

2. **Clerk Webhook** (`app/api/webhooks/clerk/route.ts`)
   - Automatically deletes users who sign up with non-allowed emails
   - Assigns `admin` or `super-admin` role based on email

3. **Clerk Dashboard** (Recommended)
   - Go to Clerk Dashboard → User & Authentication → Restrictions
   - Add email domain allowlist: `forhemit.com`
   - This prevents sign-ups at the source

---

## User Roles

### Super Admin (`stefano.stokes@forhemit.com`)
**Permissions:**
- Full access to all admin routes
- User Management (CRUD operations on other users)
- Can invite new users
- Can delete regular admin users
- Cannot be deleted by other users

**Access:**
- `/admin/users` - User management page
- `/api/admin/users` - List all users
- `/api/admin/users/invite` - Invite new users
- `/api/admin/users/[id]` - Delete users

### Admin (Regular)
**Permissions:**
- Access to all standard admin features
- CRM, Templates, Contacts, etc.
- No access to User Management

---

## User Management Features

### For Super Admin Only

#### 1. View All Users
Navigate to: `/admin/users`

Shows:
- Total user count
- List of all admin users
- User roles (Super Admin / Admin)
- Creation date
- Last sign-in date
- Profile pictures

#### 2. Invite New Users
Click "Invite User" button on `/admin/users`

Requirements:
- Must be a `@forhemit.com` email
- Sends invitation via email
- New user gets `admin` role automatically

#### 3. Delete Users
Click trash icon next to non-super-admin users

Restrictions:
- Cannot delete your own account
- Cannot delete super admin accounts
- Must confirm deletion

---

## Clerk Configuration

### 1. Session Token Template (Required)

The session token must include user claims for middleware authentication.

**In Clerk Dashboard:**
1. Go to **Sessions** → **Customize session token**
2. Replace the template with:

```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "nickname": "{{user.username}}",
  "given_name": "{{user.first_name}}",
  "updated_at": "{{user.updated_at}}",
  "family_name": "{{user.last_name}}",
  "phone_number": "{{user.primary_phone_number}}",
  "email_verified": "{{user.email_verified}}",
  "phone_number_verified": "{{user.phone_number_verified}}"
}
```

3. **Save** the configuration
4. Users will need to sign out and sign back in for changes to take effect

### 2. Webhooks (Required for User Management)

To enable automatic role assignment and email domain enforcement:

1. **Go to Clerk Dashboard** → Webhooks → Add Endpoint

2. **Configure Endpoint:**
   - URL: `https://forhemit.website/api/webhooks/clerk`
   - (For local testing: `http://localhost:5050/api/webhooks/clerk`)

3. **Select Events:**
   - `user.created`
   - `user.updated`

4. **Copy Signing Secret:**
   - Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_secret_here
   ```

5. **Test the Webhook:**
   - Sign up with a `@forhemit.com` email
   - Check that role is assigned automatically
   - Check that non-allowed emails are rejected

---

## Environment Variables

### Required for User Management

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook (Required for role assignment)
CLERK_WEBHOOK_SECRET=whsec_...

# Site URL (for invitation redirects)
NEXT_PUBLIC_SITE_URL=https://forhemit.website
```

---

## Changing Super Admin

To change the super admin email:

1. Edit `lib/clerk.ts`:
```typescript
export const SUPER_ADMIN_EMAIL = 'new.email@forhemit.com';
```

2. Redeploy the application

3. The new super admin will automatically get the role on next sign-in

4. Update Clerk Dashboard settings if needed

---

## Security Considerations

1. **Webhook Security**
   - Webhook secret should be kept secure
   - Clerk signs all webhook requests
   - Middleware double-checks email domain

2. **Super Admin Protection**
   - Super admin accounts cannot be deleted
   - Only one email can be super admin (configurable)
   - Super admin has full CRUD on other users

3. **Domain Enforcement**
   - Enforced at middleware level
   - Enforced at webhook level
   - Enforced at API route level
   - Clerk Dashboard can also enforce (recommended)

---

## Troubleshooting

### Users Not Getting Roles
1. Check webhook is configured correctly
2. Verify `CLERK_WEBHOOK_SECRET` is set
3. Check server logs for webhook errors
4. Ensure webhook URL is accessible from internet (for production)

### "Email not found in session" Error
1. Go to Clerk Dashboard → Sessions → Customize session token
2. Ensure the `email` claim is included in the template
3. Have users sign out and sign back in
4. Check that the template matches the format in this document

### Non-Allowed Emails Getting Through
1. Verify middleware is working (check logs)
2. Check webhook is deleting unauthorized users
3. Add domain restriction in Clerk Dashboard as backup

### Cannot Access User Management
1. Check you're signed in with `stefano.stokes@forhemit.com`
2. Verify `lib/clerk.ts` has correct SUPER_ADMIN_EMAIL
3. Check that your user has `super-admin` role in Clerk Dashboard

---

## API Endpoints

### User Management (Super Admin Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/invite` | POST | Invite new user |
| `/api/admin/users/[id]` | DELETE | Delete user |

### Request/Response Examples

#### List Users
```bash
GET /api/admin/users
```
Response:
```json
{
  "users": [
    {
      "id": "user_xxx",
      "email": "user@forhemit.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "createdAt": "1234567890",
      "lastSignInAt": "1234567890",
      "imageUrl": "https://..."
    }
  ]
}
```

#### Invite User
```bash
POST /api/admin/users/invite
Content-Type: application/json

{
  "email": "newuser@forhemit.com"
}
```
Response:
```json
{
  "success": true,
  "invitationId": "inv_xxx",
  "message": "Invitation sent to newuser@forhemit.com"
}
```

#### Delete User
```bash
DELETE /api/admin/users/user_xxx
```
Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

*For questions or issues, refer to Clerk documentation: https://clerk.com/docs*
