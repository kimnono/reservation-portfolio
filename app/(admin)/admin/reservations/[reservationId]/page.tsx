import { requireRole } from "@/features/auth/session";
import { ReservationDetailSection } from "@/features/booking/reservation-detail-section";

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
