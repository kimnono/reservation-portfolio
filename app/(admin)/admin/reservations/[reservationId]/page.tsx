import { ReservationDetailSection } from "@/features/booking/reservation-detail-section";

export default async function AdminReservationDetailPage(
  props: {
    params: Promise<{ reservationId: string }>;
  },
) {
  const { reservationId } = await props.params;

  return (
    <ReservationDetailSection
      reservationId={reservationId}
      viewerRole="ADMIN"
    />
  );
}
