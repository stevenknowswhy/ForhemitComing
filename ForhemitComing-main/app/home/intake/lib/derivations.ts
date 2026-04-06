import type { IntakeAnswers, DerivedClient, ClientType, PreCoopData, RoadmapData } from "../types";

export function deriveClientType(a: IntakeAnswers): DerivedClient {
  if (a.role === "broker") return { type: "D", label: "Active Sale + Broker" };
  if (a.selling === "yes" && a.broker === "yes") return { type: "D", label: "Active Sale + Broker" };
  if (a.selling === "yes" && a.broker === "no") return { type: "C", label: "Active Sale" };
  if (a.selling === "no" && a.esop === "yes") return { type: "B", label: "ESOP Planning" };
  if (a.selling === "no" && a.esop === "no") return { type: "A", label: "Resilience Only" };
  return null;
}

export function hasLenderTrack(a: IntakeAnswers) {
  return a.selling === "yes" || a.role === "broker";
}

const FIN_LABELS: Record<string, string> = {
  sba: "SBA 7(a)",
  conventional: "Conventional",
  seller_note: "Seller Note",
  esop_loan: "ESOP Loan",
  unsure: "TBD",
};

function formatFinancing(a: IntakeAnswers) {
  const ft = a.financingType;
  if (Array.isArray(ft)) {
    return ft.map((v) => FIN_LABELS[v] ?? v).join(", ");
  }
  if (typeof ft === "string") {
    return FIN_LABELS[ft] ?? ft;
  }
  return "To be confirmed";
}

export function getRoadmap(type: ClientType | undefined, a: IntakeAnswers): RoadmapData {
  const lender = hasLenderTrack(a);
  const fast = a.closeUrgency === "fast";

  const trackNote = (
    {
      dual: "Dual track — broker seeking buyers while lender package builds in parallel.",
      employee: "Employee ownership track — ESOP lender profile included.",
      single: "Single track — seller-directed sale.",
    } as const
  )[a.saleTrack as "dual" | "employee" | "single"] ?? "";

  const finLabel = formatFinancing(a);

  const urgencyNote = fast
    ? "Fast-close mode — financials and lender package are prioritized from day one. COOP and collateral build in parallel and will be finalized before closing."
    : "Full preparation mode — complete package is built and verified before going to market. You close when everything is in order.";

  const maps = {
    A: {
      headline: "Build a business that runs without you.",
      sub: "We map your critical operations and create a continuity plan that keeps everything moving — whatever happens.",
      timeline: "30–45 days",
      stations: ["Intake", "Team", "Financials", "COOP", "Package", "Monitor"],
      urgencyNote: null as string | null,
    },
    B: {
      headline: "Lay the groundwork for your ESOP.",
      sub: "We prepare your financials, document your operations, and ensure your business is structurally ready for the transition.",
      timeline: "45–60 days",
      stations: ["Intake", "Team", "Financials", "COOP", "ESOP Readiness", "Package", "Monitor"],
      urgencyNote: null as string | null,
    },
    C: fast
      ? {
          headline: "Move fast. Close with confidence.",
          sub: "Financials and lender package are front-loaded from day one. COOP and collateral materials build in parallel so nothing slows the deal.",
          timeline: "14–21 days",
          stations: ["Intake", "Financials + Lender ⟳", "Team", "COOP ⟳", "Package", "Submission", "Monitor"],
          urgencyNote,
        }
      : {
          headline: "Get your business deal-ready.",
          sub: "A complete Forhemit Package built and verified before you go to market — close on your terms, when you're ready.",
          timeline: "30–45 days",
          stations: ["Intake", "Team", "Financials", "COOP + Lender", "Package", "Submission", "Monitor"],
          urgencyNote,
        },
    D: fast
      ? {
          headline: "Fast-track the deal.",
          sub: "Broker gets a pre-COOP immediately. Financials and lender package are prioritized. Everything else builds in parallel — ready for the buyer the moment they appear.",
          timeline: "14–21 days",
          stations: ["Intake", "Financials + Lender ⟳", "Team", "COOP ⟳", "Broker Review", "Package", "Submission", "Monitor"],
          urgencyNote,
        }
      : {
          headline: "Make your deal close faster.",
          sub: "Your broker receives a pre-COOP status document immediately. The full package builds completely before submission — nothing left unfinished.",
          timeline: "21–35 days",
          stations: ["Intake", "Team", "Financials", "COOP + Lender", "Broker Review", "Package", "Submission", "Monitor"],
          urgencyNote,
        },
  };

  const base = type ? maps[type] : maps.A;
  return { ...base, lender, trackNote, finLabel };
}

export function buildPreCOOP(a: IntakeAnswers, clientId: string): PreCoopData {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const track =
    ({ dual: "Dual Track", employee: "Employee Ownership", single: "Single Track" } as const)[
      a.saleTrack as "dual" | "employee" | "single"
    ] ?? "—";
  const ft = a.financingType;
  const fin = Array.isArray(ft)
    ? ft.map((v) => FIN_LABELS[v] ?? v).join(", ")
    : typeof ft === "string"
      ? FIN_LABELS[ft] ?? "—"
      : "—";

  return {
    clientId,
    date: today,
    pct: 12,
    track,
    fin,
    done: ["Classification", "Initial Intake"],
    active: ["Team Assembly", "Financial Baseline", "COOP Build"],
    pending: ["Legal Frameworks", "Lender Package", "Final Sign-off"],
  };
}
