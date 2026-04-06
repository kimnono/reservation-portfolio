import { requireRole } from "@/features/auth/api/session";
import { AdminScheduleSection } from "@/features/admin-reservation/ui/admin-schedule-section";

export default async function AdminSchedulesPage() {
  const session = await requireRole("ADMIN");

  return <AdminScheduleSection session={session} />;
}
