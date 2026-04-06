'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { isSuperAdmin } from '@/lib/clerk';
import { useAdminMobileShell } from '@/app/admin/components/AdminMobileShell';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  AlertCircle,
  Loader2,
  X,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { AdminSearchInput } from '@/app/admin/components/AdminSearchInput';

interface ClerkUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
  lastSignInAt: string | null;
  imageUrl: string | null;
}

function displayName(u: ClerkUser): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  if (name) return name;
  const local = u.email.split('@')[0]?.replace(/[._]/g, ' ') ?? '';
  if (local) {
    return local
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return u.email;
}

export default function UsersManagementPage() {
  const { isLoaded, user } = useUser();
  const { setMobileHeaderRight } = useAdminMobileShell();
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isSuperAdminUser = isSuperAdmin(userEmail);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsConfigError(false);
      
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (!response.ok) {
        if (data.message?.includes('Configure Clerk Dashboard') || data.message?.includes('session token')) {
          setIsConfigError(true);
        }
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSuperAdminUser) {
      fetchUsers();
    }
  }, [isLoaded, isSuperAdminUser]);

  const openInvite = useCallback(() => setShowInviteModal(true), []);

  useEffect(() => {
    if (!isLoaded || !isSuperAdminUser || isConfigError) {
      setMobileHeaderRight(null);
      return;
    }
    setMobileHeaderRight(
      <button
        type="button"
        className="admin-mobile-appbar-add"
        onClick={openInvite}
      >
        Add
      </button>
    );
    return () => setMobileHeaderRight(null);
  }, [
    isLoaded,
    isSuperAdminUser,
    isConfigError,
    setMobileHeaderRight,
    openInvite,
  ]);

  // Invite user
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.endsWith('@forhemit.com')) {
      alert('Only forhemit.com email addresses are allowed');
      return;
    }

    setInviteLoading(true);
    try {
      const response = await fetch('/api/admin/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to invite user');
      }

      setInviteEmail('');
      setShowInviteModal(false);
      fetchUsers();
      alert('Invitation sent successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      fetchUsers();
      alert('User deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="loading-state-stitch">
        <div className="spinner-stitch" />
      </div>
    );
  }

  if (!isSuperAdminUser) {
    return (
      <div className="card-stitch p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-[var(--color-error)]" />
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Access Denied</h1>
        </div>
        <p className="text-[var(--text-secondary)]">
          Only the super admin can access user management.
        </p>
      </div>
    );
  }

  // Configuration Error State
  if (isConfigError) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card-stitch p-6">
          <div className="flex items-start gap-4">
            <Settings className="w-8 h-8 text-[var(--color-warning)] flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Clerk Configuration Required
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                The session token needs to be configured in your Clerk Dashboard to include the email claim.
              </p>
              
              <div className="space-y-4">
                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <h2 className="font-medium text-[var(--text-primary)] mb-2">Step 1: Go to Clerk Dashboard</h2>
                  <a 
                    href="https://dashboard.clerk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--color-brand)] hover:underline"
                  >
                    Open Clerk Dashboard
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <h2 className="font-medium text-[var(--text-primary)] mb-2">Step 2: Navigate to Sessions</h2>
                  <p className="text-[var(--text-secondary)]">
                    Go to <strong>Sessions</strong> → <strong>Customize session token</strong>
                  </p>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <h2 className="font-medium text-[var(--text-primary)] mb-2">Step 3: Add the email claim</h2>
                  <p className="text-[var(--text-secondary)] mb-2">Add this to your session token template:</p>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "aud": "convex",
  "email": "{{user.primary_email_address}}",
  "name": "{{user.full_name}}"
}`}
                  </pre>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <h2 className="font-medium text-[var(--text-primary)] mb-2">Step 4: Save and Restart</h2>
                  <p className="text-[var(--text-secondary)]">
                    1. Click <strong>Save</strong> in Clerk Dashboard<br/>
                    2. Sign out and sign back in to this admin panel<br/>
                    3. Refresh this page
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-stitch btn-stitch-primary"
                >
                  Retry After Configuration
                </button>
                <a
                  href="https://clerk.com/docs/backend-requests/making/custom-session-token"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stitch btn-stitch-secondary inline-flex items-center gap-2"
                >
                  View Clerk Docs
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const superAdmins = users.filter((u) => u.role === 'super-admin').length;
  const activeNow = users.filter((u) => !!u.lastSignInAt).length;
  const pending = Math.max(0, users.length - activeNow);

  const showExtraPagination = filteredUsers.length > 5;

  return (
    <div className="users-management-ethos pb-24 text-[#2d3435] md:pb-0">
      <div className="page-header-stitch hidden md:block">
        <div className="header-top">
          <div>
            <h1 className="page-title">Member list</h1>
            <p className="page-subtitle">
              Manage admin users, roles, and invitations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="users-ethos-primary shrink-0"
          >
            + Add user
          </button>
        </div>
      </div>

      <div className="mb-8 md:hidden">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2d3435]">
          Member List
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5a6061]">
          Manage your organization members and their access levels.
        </p>
      </div>

      <div className="space-y-6">

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-[#f2f4f4] p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#5a6061]">Total users</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{totalUsers}</p>
          </div>
          <div className="rounded-xl bg-[#f2f4f4] p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#5a6061]">Active now</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{activeNow}</p>
          </div>
          <div className="rounded-xl bg-[#f2f4f4] p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#5a6061]">Pending</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{pending}</p>
          </div>
          <div className="hidden rounded-xl bg-[#f2f4f4] p-4 md:block md:p-5">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#5a6061]">
              Super admins
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{superAdmins}</p>
          </div>
          <div className="rounded-xl bg-[#f2f4f4] p-4 md:hidden md:p-5">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#5a6061]">
              Storage
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-3xl font-bold tracking-tight">84%</p>
              <div className="h-1.5 min-w-0 flex-1 rounded-full bg-[#dde4e5]">
                <div className="h-1.5 w-[84%] rounded-full bg-[#4c635d]" />
              </div>
            </div>
          </div>
        </section>

        {error && !isConfigError && (
          <div className="rounded-xl bg-[#fff7f6] p-4 text-[#9f403d]">
            <p>{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 text-sm font-medium text-[#4c635d] underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="space-y-3 rounded-xl bg-[#f2f4f4] p-3 md:flex md:items-center md:gap-3 md:space-y-0">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search members by name or email..."
            aria-label="Search members by name or email"
            className="flex-1"
            inputClassName="rounded-xl border-none bg-white text-sm ring-0 placeholder:text-[#8d9495] focus:ring-1 focus:ring-[#4c635d]/40"
            iconLeftClassName="text-[#757c7d]"
            clearButtonClassName="text-[#757c7d] hover:bg-[#f2f4f4] hover:text-[#2d3435] focus-visible:ring-[#4c635d]/40"
          />
          <div className="flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#dde4e5] px-4 py-3 text-sm font-medium text-[#5a6061] md:flex-none">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#4c635d] to-[#415751] px-4 py-3 text-sm font-semibold text-[#e4fdf5] md:flex-none"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </button>
          </div>
        </section>

        {loading ? (
          <div className="loading-state-stitch">
            <div className="spinner-stitch" />
          </div>
        ) : (
          <>
            <section className="md:hidden">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#adb3b4]/10">
                {filteredUsers.map((u, index) => (
                  <article
                    key={u.id}
                    className={`flex items-center justify-between gap-3 px-4 py-4 ${
                      index < filteredUsers.length - 1
                        ? 'border-b border-[#adb3b4]/12'
                        : ''
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {u.imageUrl ? (
                        <img
                          src={u.imageUrl}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#cfe8e0] text-sm font-bold text-[#405651]">
                          {displayName(u)
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-[#2d3435]">
                          {displayName(u)}
                        </p>
                        <p className="truncate text-xs text-[#5a6061]">{u.email}</p>
                      </div>
                    </div>
                    {u.role !== 'super-admin' ? (
                      <details className="users-mobile-row-menu relative shrink-0">
                        <summary
                          className="flex cursor-pointer list-none items-center justify-center rounded-lg p-2 text-[#757c7d] marker:hidden [&::-webkit-details-marker]:hidden"
                          aria-label="Member actions"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </summary>
                        <div className="absolute right-0 top-full z-10 mt-1 min-w-[9rem] rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#9f403d] hover:bg-[#fff7f6]"
                            onClick={(e) => {
                              const root = e.currentTarget.closest('details');
                              root?.removeAttribute('open');
                              void handleDelete(u.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 shrink-0" />
                            Remove user
                          </button>
                        </div>
                      </details>
                    ) : (
                      <button
                        type="button"
                        className="shrink-0 rounded-lg p-2 text-[#757c7d]"
                        aria-label="Super admin"
                        disabled
                      >
                        <MoreVertical className="h-5 w-5 opacity-40" />
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="hidden overflow-hidden rounded-xl bg-white md:block">
              <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr_80px] bg-[#f2f4f4] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5a6061]">
                <p>User</p>
                <p>Role</p>
                <p>Created</p>
                <p>Last Sign In</p>
                <p className="text-right">Actions</p>
              </div>
              {filteredUsers.map((u) => (
                <div key={u.id} className="grid grid-cols-[2.2fr_1fr_1fr_1fr_80px] items-center px-6 py-4 hover:bg-[#f9fbfb]">
                  <div className="flex min-w-0 items-center gap-3">
                    {u.imageUrl ? (
                      <img src={u.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cfe8e0] text-xs font-bold text-[#405651]">
                        {u.firstName?.[0] || u.email[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{displayName(u)}</p>
                      <p className="truncate text-sm text-[#5a6061]">{u.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dde4e5] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#5a6061]">
                      {u.role === 'super-admin' ? <Shield className="h-3 w-3" /> : null}
                      {u.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                  <p className="text-sm text-[#5a6061]">
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-[#5a6061]">
                    {u.lastSignInAt
                      ? new Date(u.lastSignInAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Never'}
                  </p>
                  <div className="justify-self-end">
                    {u.role !== 'super-admin' ? (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="rounded-lg p-2 text-[#9f403d] hover:bg-[#fff7f6]"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button className="rounded-lg p-2 text-[#757c7d]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </section>

            {filteredUsers.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f4]">
                  <Users className="h-6 w-6 text-[#5a6061]" />
                </div>
                <p className="font-semibold">No users found</p>
                <p className="mt-1 text-sm text-[#5a6061]">
                  {searchQuery ? 'Try adjusting your search' : 'Get started by inviting a new user'}
                </p>
              </div>
            )}
          </>
        )}

        <footer className="flex flex-col items-start justify-between gap-4 text-sm text-[#5a6061] sm:flex-row sm:items-center">
          <p>
            {searchQuery.trim()
              ? `${filteredUsers.length} matching “${searchQuery}” (${users.length} total)`
              : filteredUsers.length <= 1
                ? `Showing ${filteredUsers.length} of ${users.length} members`
                : `Showing 1 to ${filteredUsers.length} of ${users.length} members`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-[#e4e9ea] p-2 text-[#5a6061] disabled:opacity-40"
              disabled
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-9 w-9 rounded-lg bg-[#4c635d] text-sm font-semibold text-[#e4fdf5]"
            >
              1
            </button>
            {showExtraPagination ? (
              <>
                <button
                  type="button"
                  className="h-9 w-9 rounded-lg border border-[#e5e7eb] bg-white text-sm font-semibold text-[#5a6061]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-lg border border-[#e5e7eb] bg-white text-sm font-semibold text-[#5a6061]"
                >
                  3
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="rounded-lg bg-[#e4e9ea] p-2 text-[#5a6061] disabled:opacity-40"
              disabled={!showExtraPagination}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div 
          className="modal-overlay-stitch"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteModal(false);
          }}
        >
          <div className="modal-container-stitch">
            <div className="modal-header-stitch">
              <h2 className="modal-title-stitch">Invite User</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="modal-close-stitch"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-content-stitch">
                <div className="form-group-stitch">
                  <label className="form-label-stitch">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@forhemit.com"
                    required
                    className="form-input-stitch"
                  />
                  <p className="form-hint-stitch">
                    Must be a @forhemit.com email address
                  </p>
                </div>
              </div>
              <div className="modal-footer-stitch">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-stitch btn-stitch-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail.endsWith('@forhemit.com')}
                  className="btn-stitch btn-stitch-primary"
                >
                  {inviteLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Send Invitation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
