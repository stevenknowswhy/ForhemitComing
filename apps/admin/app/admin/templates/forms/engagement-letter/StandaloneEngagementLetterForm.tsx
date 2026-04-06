"use client";

/**
 * Standalone Engagement Letter — full-page dark/light document + deal configuration
 * served from /forms/engagement-letter-standalone.html (keeps provided HTML/CSS/JS intact).
 * Does not sync shared localStorage with Stewardship Agreement.
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../../registry";

const IFRAME_SRC = "/forms/engagement-letter-standalone.html";

const TITLE_OPTIONS = new Set([
  "Owner",
  "Managing Member",
  "President",
  "CEO",
  "Chairman",
  "Managing Partner",
  "General Partner",
  "Sole Proprietor",
  "Director",
  "Authorized Representative",
]);

function applyTitle(doc: Document, title: string) {
  const sel = doc.getElementById("f-of-title-sel") as HTMLSelectElement | null;
  const custom = doc.getElementById("f-of-title-custom") as HTMLInputElement | null;
  if (!sel || !custom) return;
  if (!title) return;
  if (TITLE_OPTIONS.has(title)) {
    sel.value = title;
    custom.classList.add("hidden-field");
    custom.value = "";
  } else {
    sel.value = "_other";
    custom.classList.remove("hidden-field");
    custom.value = title;
  }
}

function mapTailToSelect(value: unknown): string {
  if (typeof value !== "string") return "180";
  if (value.includes("90") && !value.includes("180") && !value.includes("270")) return "90";
  if (value.includes("180")) return "180";
  if (value.includes("270")) return "270";
  if (value.includes("365")) return "365";
  return "180";
}

function mapStateToGs(state: string): string {
  const codes: Record<string, string> = {
    California: "CA",
    Florida: "FL",
    Texas: "TX",
    Tennessee: "TN",
    Delaware: "DE",
    "New York": "NY",
    Nevada: "NV",
  };
  if (codes[state]) return codes[state];
  const t = state.trim();
  if (/^[A-Z]{2}$/.test(t)) return t;
  return "CA";
}

function mapPm(method: string): string {
  const m = method.toLowerCase();
  if (m.includes("ach") || m.includes("stripe")) return "ach";
  if (m.includes("check")) return "check";
  return "wire";
}

function scrapeFormData(doc: Document | null): Record<string, unknown> {
  if (!doc) return {};
  const v = (id: string) =>
    (doc.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value ??
    "";
  const chk = (id: string) => (doc.getElementById(id) as HTMLInputElement | null)?.checked ?? false;

  const sel = doc.getElementById("f-of-title-sel") as HTMLSelectElement | null;
  const custom = doc.getElementById("f-of-title-custom") as HTMLInputElement | null;
  const officerTitle = sel?.value === "_other" ? custom?.value ?? "" : sel?.value ?? "";

  return {
    template: "engagement-letter-standalone",
    company: v("f-co"),
    officerName: v("f-of-name"),
    officerTitle,
    reference: v("f-ref"),
    effectiveDate: v("f-dt"),
    ebitda: v("f-eb"),
    feeTier: v("f-ti"),
    retainerAmount: v("f-ra"),
    paymentMethod: v("f-pm"),
    paymentDue: v("f-pd"),
    governingState: v("f-gs"),
    arbitrationCounty: v("f-ac"),
    tailDays: v("f-tl"),
    brokerInvolved: chk("f-broker-tog"),
    brokerName: v("f-bn"),
    brokerFirm: v("f-bf"),
    additionalTerms: v("f-ad"),
    retainerRefundable: chk("tog-ret"),
    themeLight: chk("tog-theme"),
  };
}

function setVal(doc: Document, id: string, value: string) {
  const el = doc.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (el && value !== undefined && value !== null) el.value = String(value);
}

function applyInitialData(doc: Document, raw: Record<string, unknown>) {
  if (typeof raw.s_company === "string") setVal(doc, "f-co", raw.s_company);
  if (typeof raw.officer_name === "string") setVal(doc, "f-of-name", raw.officer_name);
  applyTitle(doc, typeof raw.officer_title === "string" ? raw.officer_title : "");
  if (typeof raw.s_ref === "string") setVal(doc, "f-ref", raw.s_ref);
  if (typeof raw.s_date === "string") setVal(doc, "f-dt", raw.s_date);
  if (typeof raw.ev === "string") setVal(doc, "f-eb", raw.ev);
  if (typeof raw.retainer_date === "string") setVal(doc, "f-pd", raw.retainer_date);
  if (typeof raw.retainer_method === "string") {
    const pm = doc.getElementById("f-pm") as HTMLSelectElement | null;
    if (pm) pm.value = mapPm(raw.retainer_method);
  }
  const gov =
    typeof raw.gov_law === "string"
      ? raw.gov_law
      : typeof raw.state === "string"
        ? raw.state
        : "";
  if (gov) setVal(doc, "f-gs", mapStateToGs(gov));
  if (typeof raw.venue_county === "string") setVal(doc, "f-ac", raw.venue_county);
  if (raw.tail !== undefined) {
    const tl = doc.getElementById("f-tl") as HTMLSelectElement | null;
    if (tl) tl.value = mapTailToSelect(raw.tail);
  }
  if (raw.has_broker === "yes") {
    const t = doc.getElementById("f-broker-tog") as HTMLInputElement | null;
    if (t) {
      t.checked = true;
      t.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  if (typeof raw.broker_name === "string") setVal(doc, "f-bn", raw.broker_name);
  if (typeof raw.broker_firm === "string") setVal(doc, "f-bf", raw.broker_firm);
  if (typeof raw.special_terms === "string") setVal(doc, "f-ad", raw.special_terms);

  doc.querySelectorAll(".cp-body input, .cp-body select, .cp-body textarea").forEach((el) => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

const StandaloneEngagementLetterForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function StandaloneEngagementLetterForm({ initialData }, ref) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const initialKey = useRef<string>("");

  const runApplyInitial = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    if (!initialData || Object.keys(initialData).length === 0) return;
    const key = JSON.stringify(initialData);
    if (key === initialKey.current) return;
    applyInitialData(doc, initialData);
    initialKey.current = key;
  }, [initialData]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      initialKey.current = "";
      runApplyInitial();
    };

    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete") onLoad();

    return () => iframe.removeEventListener("load", onLoad);
  }, [runApplyInitial]);

  useEffect(() => {
    initialKey.current = "";
    const doc = iframeRef.current?.contentDocument;
    if (doc?.readyState === "complete") runApplyInitial();
  }, [initialData, runApplyInitial]);

  useImperativeHandle(
    ref,
    () => ({
      getFormData: () => scrapeFormData(iframeRef.current?.contentDocument ?? null),
      getContainerRef: () =>
        (iframeRef.current?.contentDocument?.documentElement ?? null) as HTMLDivElement | null,
      printContract: () => {
        iframeRef.current?.contentWindow?.print();
      },
    }),
    []
  );

  return (
    <iframe
      ref={iframeRef}
      src={IFRAME_SRC}
      title="Engagement Letter (standalone)"
      className="w-full rounded-lg border border-white/10 bg-[#0d0d0d]"
      style={{ minHeight: "min(90vh, 1400px)", height: "1200px" }}
    />
  );
});

export default StandaloneEngagementLetterForm;
