import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Admin",
  description: "Manage Forhemit admin users and invitations",
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
