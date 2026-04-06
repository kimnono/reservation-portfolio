import { requireRole } from "@/features/auth/api/session";
import { MyReservationsSection } from "@/features/booking/ui/my-reservations-section";

export default async function MyReservationsPage() {
  const session = await requireRole(["USER", "ADMIN"]);

  return <MyReservationsSection session={session} />;
}
