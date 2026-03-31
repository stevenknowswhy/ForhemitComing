import type { CalendarRole, RoleMeta } from "../types";

export const ROLE_META: Record<CalendarRole, RoleMeta> = {
  forhemit: {
    label: "Forhemit",
    color: "#8A6A2A",
    bg: "rgba(138,106,42,0.10)",
    bd: "rgba(138,106,42,0.32)",
  },
  broker: {
    label: "Broker",
    color: "#1E2D45",
    bg: "rgba(30,45,69,0.08)",
    bd: "rgba(30,45,69,0.28)",
  },
  owner: {
    label: "Owner",
    color: "#2A5C3A",
    bg: "rgba(42,92,58,0.09)",
    bd: "rgba(42,92,58,0.30)",
  },
  lender: {
    label: "Lender",
    color: "#5C2A45",
    bg: "rgba(92,42,69,0.09)",
    bd: "rgba(92,42,69,0.30)",
  },
  trustee: {
    label: "Trustee",
    color: "#2A455C",
    bg: "rgba(42,69,92,0.09)",
    bd: "rgba(42,69,92,0.30)",
  },
  legal: {
    label: "Legal",
    color: "#5C452A",
    bg: "rgba(92,69,42,0.09)",
    bd: "rgba(92,69,42,0.30)",
  },
  cpa: {
    label: "CPA / QofE",
    color: "#3A2A5C",
    bg: "rgba(58,42,92,0.09)",
    bd: "rgba(58,42,92,0.30)",
  },
  appraiser: {
    label: "Appraiser",
    color: "#6B5B3A",
    bg: "rgba(107,91,58,0.09)",
    bd: "rgba(107,91,58,0.30)",
  },
  tpa: {
    label: "TPA",
    color: "#3A6B5B",
    bg: "rgba(58,107,91,0.09)",
    bd: "rgba(58,107,91,0.30)",
  },
  "tr-counsel": {
    label: "Trustee Counsel",
    color: "#5B3A6B",
    bg: "rgba(91,58,107,0.09)",
    bd: "rgba(91,58,107,0.30)",
  },
  "sec-lender": {
    label: "Secondary Lender",
    color: "#8A3A3A",
    bg: "rgba(138,58,58,0.09)",
    bd: "rgba(138,58,58,0.30)",
  },
  "sec-counsel": {
    label: "Sec. Lender Counsel",
    color: "#6B3A5B",
    bg: "rgba(107,58,91,0.09)",
    bd: "rgba(107,58,91,0.30)",
  },
  "closing-agent": {
    label: "Closing Agent",
    color: "#3A5B6B",
    bg: "rgba(58,91,107,0.09)",
    bd: "rgba(58,91,107,0.30)",
  },
};
