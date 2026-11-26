import DailyView from "../daily-view";

// The daily view is a per-request dashboard: at runtime Vercel injects project env
// into the serverless function (not filtered by turbo), and prerendering would
// also bake stale data at deploy time.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <DailyView />;
}
