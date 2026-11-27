'use client';

import type { ViewMode } from '@forhemit/shared/features/esop-partners';
import { AdminAreaLinks, SignOutLink } from '../../admin-nav';
import type { ContactCounts } from './ViewControls';

// OD-13: views and partner types moved into the ESOP page (ViewControls) —
// the rail is the shared admin chrome only. AdminChrome still types its
// registration API against SidebarProps, so the props contract stays; nothing
// renders the old Views / Partner-types sections here anymore.
export interface SidebarProps {
  currentView: ViewMode;
  currentType: string | null;
  contactCounts: ContactCounts;
  onSetView: (view: ViewMode) => void;
  onFilterType: (type: string | null) => void;
}

export function Sidebar(_props: SidebarProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Admin areas (OD-12: URL-driven cross-area nav) */}
      <AdminAreaLinks />

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-white/10 text-[10px] text-white/25">
        <div className="-mx-1.5 mb-2">
          <SignOutLink />
        </div>
        ESOP Transaction Forms · 2025<br />
        Auto-saved locally
      </div>
    </div>
  );
}
