"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isAllowedEmail } from "@/lib/clerk";
import AdminSidebar from "./AdminSidebar";
import {
  AdminMobileAppBar,
  AdminMobileBottomNav,
  AdminMobileShellProvider,
  useAdminMobileShell,
} from "./AdminMobileShell";
import { AlertCircle } from "lucide-react";
import "@/app/admin/admin-stitch.css";

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-desktop-collapsed";

function AdminLayoutBody({
  children,
  contactCount,
  earlyAccessCount,
  applicationCount,
  userButton,
}: {
  children: React.ReactNode;
  contactCount: number;
  earlyAccessCount: number;
  applicationCount: number;
  userButton: React.ReactNode;
}) {
  const { sidebarOpen, closeSidebar } = useAdminMobileShell();
  const pathname = usePathname();
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setDesktopSidebarCollapsed(
        typeof window !== "undefined" &&
          window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1"
      );
    } catch {
      /* ignore */
    }
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setDesktopSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  const layoutClass =
    "admin-layout-stitch" +
    (desktopSidebarCollapsed ? " admin-layout-sidebar-collapsed" : "");

  return (
    <div className={layoutClass}>
      {sidebarOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      ) : null}
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onCloseMobile={closeSidebar}
        desktopCollapsed={desktopSidebarCollapsed}
        onToggleDesktopCollapse={toggleDesktopSidebar}
        contactCount={contactCount}
        earlyAccessCount={earlyAccessCount}
        applicationCount={applicationCount}
        userButton={userButton}
      />
      <main className="admin-main-stitch">
        <AdminMobileAppBar />
        <div className="admin-main-content-stitch">{children}</div>
        <AdminMobileBottomNav />
      </main>
    </div>
  );
}

interface AdminClientLayoutProps {
  children: React.ReactNode;
}

export function AdminClientLayout({ children }: AdminClientLayoutProps) {
  const { isLoaded, user } = useUser();
  
  // Only fetch data when user is authenticated
  const contacts = useQuery(api.contactSubmissions.list, isLoaded && user ? { limit: 100 } : "skip");
  const earlyAccess = useQuery(api.earlyAccessSignups.list, isLoaded && user ? { limit: 100 } : "skip");
  const applications = useQuery(api.jobApplications.list, isLoaded && user ? { limit: 100 } : "skip");

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  // If not authenticated, this should not render due to middleware
  if (!user) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Please sign in to access the admin panel.</p>
      </main>
    );
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAllowed = userEmail ? isAllowedEmail(userEmail) : false;

  // If email is not from allowed domain, show error
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
          </div>
          
          <p className="text-gray-600 mb-4">
            Your email <strong className="text-gray-900">{userEmail}</strong> is not authorized to access this application.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              Only <strong>@forhemit.com</strong> email addresses are allowed.
            </p>
          </div>

          <div className="space-y-3">
            <UserButton 
              appearance={{
                elements: {
                  userButtonTrigger: 'w-full justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600',
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
    <AdminMobileShellProvider>
      <AdminLayoutBody
          contactCount={contacts?.length || 0}
          earlyAccessCount={earlyAccess?.length || 0}
          applicationCount={applications?.length || 0}
          userButton={<UserButton />}
        >
          {children}
        </AdminLayoutBody>
    </AdminMobileShellProvider>
  );
}
