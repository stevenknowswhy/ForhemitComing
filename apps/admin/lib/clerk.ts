// Clerk configuration and utilities

// Super admin email - full access
export const SUPER_ADMIN_EMAIL = 'stefano.stokes@forhemit.com';

// Allowed email domain for sign-ups
export const ALLOWED_EMAIL_DOMAIN = 'forhemit.com';

// Check if email is from allowed domain
export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN.toLowerCase()}`);
}

// Check if user is super admin
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

// Get user role based on email
export function getUserRole(email: string | null | undefined): 'super-admin' | 'admin' | null {
  if (!email) return null;
  if (isSuperAdmin(email)) return 'super-admin';
  if (isAllowedEmail(email)) return 'admin';
  return null;
}
