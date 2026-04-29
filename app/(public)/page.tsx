import { BookingHomeView } from "@/features/booking/ui/booking-home-view";
import { getSession } from "@/features/auth/api/session";

export default async function HomePage() {
  const session = await getSession();
  return <BookingHomeView session={session} />;
}
