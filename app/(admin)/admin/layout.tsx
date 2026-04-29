import { requireRole } from "@/features/auth/session";
import { AdminShell } from "@/features/admin-layout/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRole("ADMIN");

  return <AdminShell userName={session.user?.name}>{children}</AdminShell>;
}
