import { requireRole } from "@/features/auth/api/session";
import { AdminShell } from "@/features/admin-layout/ui/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRole("ADMIN");

  return <AdminShell userName={session.user?.name}>{children}</AdminShell>;
}
