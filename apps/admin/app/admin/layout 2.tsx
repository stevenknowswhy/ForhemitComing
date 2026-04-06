import type { Metadata } from "next";
import { AdminClientLayout } from "./components/AdminClientLayout";
import "./admin-layout.css";

export const metadata: Metadata = {
  title: "Admin | Forhemit",
  description: "Forhemit Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
