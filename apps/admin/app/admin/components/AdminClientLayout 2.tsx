"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isAllowedEmail, isSuperAdmin } from "@/lib/clerk";
import AdminSidebar from "./AdminSidebar";
import { AlertCircle, Loader2 } from "lucide-react";

interface AdminClientLayoutProps {
  children: React.ReactNode;
}

export function AdminClientLayout({ children }: AdminClientLayoutProps) {
  const { isLoaded, user } = useUser();
  
  // Fetch stats for sidebar
  const contacts = useQuery(api.contactSubmissions.list, { limit: 100 });
  const earlyAccess = useQuery(api.earlyAccessSignups.list, { limit: 100 });
  const applications = useQuery(api.jobApplications.list, { limit: 100 });

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <main className="admin-auth-page">
        <div className="admin-auth-loading">
          <div className="admin-auth-spinner" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // If not authenticated, this should not render due to middleware
  if (!user) {
    return (
      <main className="admin-auth-page">
        <div className="admin-auth-loading">
          <p>Please sign in to access the admin panel.</p>
        </div>
      </main>
    );
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAllowed = userEmail ? isAllowedEmail(userEmail) : false;

  // If email is not from allowed domain, show error
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          </div>
          
          <p className="text-gray-600 mb-4">
            Your email <strong className="text-gray-900">{userEmail}</strong> is not authorized to access this application.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              Only <strong>@forhemit.com</strong> email addresses are allowed.
            </p>
          </div>

          <div className="space-y-3">
            <UserButton 
              appearance={{
                elements: {
                  userButtonTrigger: 'w-full justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800',
                }
              }}
            />
            <p className="text-xs text-gray-500 text-center">
              Click above to sign out and use a different account
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show admin content with Clerk UserButton
  return (
    <div className="admin-layout">
      <AdminSidebar
        contactCount={contacts?.length || 0}
        earlyAccessCount={earlyAccess?.length || 0}
        applicationCount={applications?.length || 0}
        userButton={<UserButton />}
      />
      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-header-user">
            <span className="admin-header-welcome">
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
            </span>
            {isSuperAdmin(userEmail) && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Super Admin
              </span>
            )}
            <UserButton />
          </div>
        </div>
        <div className="admin-main-content">{children}</div>
      </main>
    </div>
  );
}
