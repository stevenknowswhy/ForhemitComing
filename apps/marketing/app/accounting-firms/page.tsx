import type { Metadata } from "next";
import "./accounting-firms.css";
import { AccountingFirmsClient } from "@forhemit/shared/pages/AccountingFirmsClient";

const title = "For CPAs & Accounting Firms | Forhemit";
const description =
	"For CPAs: you see the succession problem first. Now you can offer the answer — how Forhemit works with the CPA who makes the introduction.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
	},
};

export default function AccountingFirmsPage() {
	return <AccountingFirmsClient />;
}
