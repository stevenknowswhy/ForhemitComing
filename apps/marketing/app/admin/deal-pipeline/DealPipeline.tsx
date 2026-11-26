import { getPipelineData } from "./lib/queries";
import { supabaseConfigured } from "./lib/supabase";
import { Board } from "./components/Board";
import type { PipelineData } from "./types";

// Server component: fetches the Supabase serving layer server-side and
// renders the full deal pipeline board (Researched -> Closed / Stewardship).
// Degrades to a plain note when Supabase env is absent, matching DailyView.

export default async function DealPipeline() {
  if (!supabaseConfigured()) {
    return (
      <p style={{ opacity: 0.8 }}>
        Deal pipeline: Supabase is not configured on this deployment yet
        (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). The board appears here as
        soon as those env vars are set.
      </p>
    );
  }
  let data: PipelineData;
  try {
    data = await getPipelineData();
  } catch (e) {
    return (
      <p style={{ opacity: 0.8 }}>
        Deal pipeline: Supabase read failed —{" "}
        {e instanceof Error ? e.message : String(e)}
      </p>
    );
  }
  return <Board data={data} />;
}
