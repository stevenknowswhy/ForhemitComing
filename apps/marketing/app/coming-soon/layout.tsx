import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Forhemit is not yet publicly available. Invitation-only preview.",
  robots: { index: false, follow: false },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
