# Troubleshooting Guide

## Console Errors Fixed

### 1. Content Security Policy (CSP) Errors

**Fixed by:**
- Added `blob:` to `script-src` directive
- Added `worker-src 'self' blob:` directive  
- Added `https://clerk-telemetry.com` to `connect-src` directive

**If you still see CSP errors:**
Restart the dev server to pick up the new headers.

### 2. "No auth provider found matching the given token"

This means Convex can't verify the Clerk JWT. Check these:

#### A. Verify JWT Issuer Domain

In your **Clerk Dashboard**:
1. Go to **API Keys**
2. Look for the **JWT Issuer** or check the domain in your publishable key
3. Your publishable key is: `pk_test_ZW5vdWdoLWhlcm1pdC00LmNsZXJrLmFjY291bnRzLmRldiQ`
4. The domain is: `https://enough-hermit-4.clerk.accounts.dev`

Make sure this matches in `convex/auth.config.ts`:
```typescript
domain: "https://enough-hermit-4.clerk.accounts.dev"
```

#### B. Verify Session Token "aud" Claim

In your **Clerk Dashboard**:
1. Go to **Sessions** → **Customize session token**
2. Make sure the template includes:
```json
{
  "aud": "convex",
  ...
}
```

3. In `convex/auth.config.ts`, make sure:
```typescript
applicationID: "convex"
```

These must match!

#### C. Restart Convex Dev Server

After changing `convex/auth.config.ts`, restart the Convex dev server:

```bash
# Terminal 1 - Restart Convex
npx convex dev

# Terminal 2 - Restart Next.js  
npm run dev
```

#### D. Check the JWT in Browser

1. Open DevTools → Application → Cookies
2. Find the `__session` cookie
3. Copy the value and decode it at https://jwt.io
4. Verify:
   - `iss` (issuer) should match your Clerk domain
   - `aud` (audience) should be `"convex"`

### 3. Development Keys Warning

This is expected in development. For production:
1. Use production Clerk keys (pk_live_*, sk_live_*)
2. Update `.env.local` with production keys
3. Deploy to production

## Testing Authentication

### Check Session Token

Add this to any page to debug:

```typescript
'use client';
import { useSession } from '@clerk/nextjs';

export default function DebugPage() {
  const { session } = useSession();
  
  // Get the JWT token
  const getToken = async () => {
    const token = await session?.getToken({ template: 'convex' });
    console.log('JWT Token:', token);
    // Decode at jwt.io to verify claims
  };
  
  return <button onClick={getToken}>Get Token</button>;
}
```

### Verify Convex Auth is Working

In your component:

```typescript
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function TestComponent() {
  const { isLoaded, userId } = useAuth();
  
  // This will fail if auth isn't working
  const data = useQuery(api.someFunction.someQuery);
  
  if (!isLoaded) return <div>Loading auth...</div>;
  if (!userId) return <div>Not authenticated</div>;
  
  return <div>Authenticated as: {userId}</div>;
}
```

## Still Having Issues?

### Nuclear Option: Clear Everything

1. **Clear browser cookies** for localhost:5050
2. **Restart both servers:**
   ```bash
   # Stop both terminals (Ctrl+C)
   
   # Terminal 1
   npx convex dev
   
   # Terminal 2  
   npm run dev
   ```
3. **Sign out and sign back in**

### Check Convex Logs

```bash
npx convex logs
```

Look for auth-related errors.

### Verify Environment Variables

Make sure these are set in `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://enough-hermit-4.clerk.accounts.dev
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-587.convex.cloud
```

## Contact Support

If issues persist:
- Clerk Docs: https://clerk.com/docs
- Convex Docs: https://docs.convex.dev/auth/clerk
- Clerk Discord: https://discord.com/invite/b5rXHjA7ye
