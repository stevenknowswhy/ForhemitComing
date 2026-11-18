import type { Metadata } from "next";
import { FourMonthPathClient } from "./FourMonthPathClient";

const title = "The Four-Month Path | Forhemit";
const description =
  "The whole route from first review to a company your employees own outright: four months, in four defined stages, with the fee and the tax treatment stated in writing before you commit.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function FourMonthPathPage() {
  return <FourMonthPathClient />;
}
