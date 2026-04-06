import { requireRole } from "@/features/auth/api/session";
import { ReservationDetailSection } from "@/features/booking/ui/reservation-detail-section";

export default async function AdminReservationDetailPage(
  props: {
    params: Promise<{ reservationId: string }>;
  },
) {
  const session = await requireRole("ADMIN");
  const { reservationId } = await props.params;

  return (
    <ReservationDetailSection
      reservationId={reservationId}
      viewerUserId={String(session.user?.userId ?? "")}
      viewerRole="ADMIN"
    />
  );
}
