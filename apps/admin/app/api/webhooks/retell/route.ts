import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verification - verify Retell signature if needed
    // const signature = req.headers.get('X-Retell-Signature');

    // Expected format: payload.event === 'call_analyzed'
    // payload.call contains the call details
    if (payload.event === "call_analyzed" || payload.event === "call_ended") {
      const call = payload.call;

      if (!call || !call.call_id) {
        return NextResponse.json({ error: "Invalid call payload" }, { status: 400 });
      }

      await fetchMutation(api.phoneMessages.saveWebhookMessage, {
        callId: call.call_id,
        agentId: call.agent_id,
        callerNumber: call.from_number || call.customer_number || call.caller_number, // varies based on inbound/outbound setup
        transcript: call.transcript,
        recordingUrl: call.recording_url,
        status: call.call_status === "ended" ? "completed" : call.call_status,
        duration: call.duration_ms ? Math.floor(call.duration_ms / 1000) : undefined,
        summary: call.call_analysis?.call_summary,
        metadata: call,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Ignored event type" });
  } catch (error) {
    console.error("Error processing Retell webhook:", error);
    return NextResponse.json(
      { error: "Internal server error processing webhook" },
      { status: 500 }
    );
  }
}
