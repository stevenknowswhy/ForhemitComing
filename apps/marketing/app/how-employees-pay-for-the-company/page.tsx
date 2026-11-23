import type { Metadata } from "next";
import { EmployeesPayPageClient } from "./EmployeesPayPageClient";

const title = "How Do Your Employees Actually Pay for the Company?";
const description =
  "Your employees don't pay out of pocket, and they don't take personal loans. The buyer is an ESOP trust, created for them — a bank lends part of the price, you carry a note for the rest, and the company repays both from its own future profits.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | Forhemit`,
    description,
  },
};

export default function EmployeesPayPage() {
  return <EmployeesPayPageClient />;
}
