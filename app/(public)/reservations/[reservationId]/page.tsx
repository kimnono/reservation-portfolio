import { requireRole } from "@/features/auth/session";
import { ReservationDetailSection } from "@/features/booking/reservation-detail-section";

export default async function ReservationDetailPage(
  props: {
    params: Promise<{ reservationId: string }>;
  },
) {
  const session = await requireRole(["USER", "ADMIN"]);
  const { reservationId } = await props.params;

  return (
    <ReservationDetailSection
      reservationId={reservationId}
      viewerUserId={String(session.user?.userId ?? "")}
      viewerRole={session.user?.role === "ADMIN" ? "ADMIN" : "USER"}
    />
  );
}
