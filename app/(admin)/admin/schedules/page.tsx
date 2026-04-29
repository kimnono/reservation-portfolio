import { requireRole } from "@/features/auth/session";
import { AdminScheduleSection } from "@/features/admin-reservation/admin-schedule-section";

export default async function AdminSchedulesPage() {
  const session = await requireRole("ADMIN");

  return <AdminScheduleSection session={session} />;
}
