import type { Metadata } from "next";
import { BrokerScreeningClient } from "./BrokerScreeningClient";

const title = "Broker Deal Screening | Forhemit";
const description =
  "Is your client a fit for an ESOP transaction? This is the same checklist Forhemit uses internally to evaluate every deal submission. No personal information is collected or stored.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function BrokerScreeningPage() {
  return <BrokerScreeningClient />;
}
