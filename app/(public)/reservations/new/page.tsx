import { ReservationCreateForm } from "@/features/booking/reservation-create-form";

export default async function NewReservationPage(
  props: {
    searchParams: Promise<{
      resourceId?: string | string[];
      date?: string | string[];
      startTime?: string | string[];
      endTime?: string | string[];
    }>;
  },
) {
  const searchParams = await props.searchParams;
  const selectedResourceId =
    typeof searchParams.resourceId === "string" ? searchParams.resourceId : undefined;
  const selectedDate =
    typeof searchParams.date === "string" ? searchParams.date : undefined;
  const selectedStartTime =
    typeof searchParams.startTime === "string" ? searchParams.startTime : undefined;
  const selectedEndTime =
    typeof searchParams.endTime === "string" ? searchParams.endTime : undefined;

  return (
    <ReservationCreateForm
      selectedResourceId={selectedResourceId}
      selectedDate={selectedDate}
      selectedStartTime={selectedStartTime}
      selectedEndTime={selectedEndTime}
    />
  );
}
