import { requireRole } from "@/features/auth/session";
import { MyReservationsSection } from "@/features/booking/my-reservations-section";

export default async function MyReservationsPage() {
  const session = await requireRole(["USER", "ADMIN"]);

  return <MyReservationsSection session={session} />;
}
