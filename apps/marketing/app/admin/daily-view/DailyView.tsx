import type { DailyViewData } from "./types";
import { getDailyViewData } from "./lib/queries";
import { supabaseConfigured } from "./lib/supabase";
import { DoneToday, NeedsYou, OutreachToday, Pipeline, SyncHealthLine } from "./components/Blocks";

// Server component: fetches the Supabase mirror server-side and renders the
// four daily blocks in spec order (Needs you / Outreach / Pipeline / Done),
// with the sync-health line on top so a silent sync failure is visible.

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
    <div>
      <SyncHealthLine data={data} />
      <NeedsYou data={data} />
      <OutreachToday data={data} />
      <Pipeline data={data} />
      <DoneToday data={data} />
    </div>
  );
}
