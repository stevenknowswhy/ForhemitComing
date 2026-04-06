"use client";

import { EngagementTracker } from "./index";

// ============================================
// CRM Page
// ============================================

export default function CRMPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-[calc(100dvh-7.75rem)] min-h-[420px] lg:h-[calc(100vh-7rem)]">
      <EngagementTracker />
    </div>
  );
}
