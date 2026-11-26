import type { DailyViewData } from "./types";
import { getDailyViewData } from "./lib/queries";
import { supabaseConfigured } from "./lib/supabase";
import { DoneToday, NeedsYou, OutreachToday, Pipeline } from "./components/Blocks";

// Server component: fetches the Supabase mirror server-side and renders the
// four daily blocks in spec order (Needs you / Outreach / Pipeline / Done).
// The sync-health line lives in the admin shell (see app/admin/(shell)).

export default async function DailyView() {
  if (!supabaseConfigured()) {
    return (
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Daily view: Supabase is not configured on this deployment yet
        (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). The four blocks appear
        here as soon as those env vars are set.
      </p>
    );
  }
  let data: DailyViewData;
  try {
    data = await getDailyViewData();
  } catch (e) {
    return (
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Daily view: Supabase read failed — {e instanceof Error ? e.message : String(e)}
      </p>
    );
  }
  return (
    <div className="space-y-6">
      <NeedsYou data={data} />
      <OutreachToday data={data} />
      <Pipeline data={data} />
      <DoneToday data={data} />
    </div>
  );
}
