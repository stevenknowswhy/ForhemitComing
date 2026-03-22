"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminLogin from "../login";
import AdminSidebar from "./AdminSidebar";

interface AdminClientLayoutProps {
  children: React.ReactNode;
}

export function AdminClientLayout({ children }: AdminClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure we only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if already authenticated on mount
  useEffect(() => {
    if (!isClient) return;
    
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [isClient]);

  // Show loading state while checking auth or before client mount
  if (!isClient || isCheckingAuth) {
    return (
      <main className="admin-auth-page">
        <div className="admin-auth-loading">
          <div className="admin-auth-spinner" />
          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="admin-auth-page">
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </main>
    );
  }

  // Show admin content if authenticated
  return (
    <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)}>
      {children}
    </AuthenticatedLayout>
  );
}

// Separate component for authenticated state to use Convex hooks
function AuthenticatedLayout({ 
  children, 
  onLogout 
}: { 
  children: React.ReactNode; 
  onLogout: () => void;
}) {
  const contacts = useQuery(api.contactSubmissions.list, { limit: 100 });
  const earlyAccess = useQuery(api.earlyAccessSignups.list, { limit: 100 });
  const applications = useQuery(api.jobApplications.list, { limit: 100 });

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }
    onLogout();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        contactCount={contacts?.length || 0}
        earlyAccessCount={earlyAccess?.length || 0}
        applicationCount={applications?.length || 0}
        onLogout={handleLogout}
      />
      <main className="admin-main">
        <div className="admin-main-content">{children}</div>
      </main>
    </div>
  );
}
