import { BookingHomeView } from "@/features/booking/booking-home-view";
import { getSession } from "@/features/auth/session";

export default async function HomePage() {
  const session = await getSession();
  return <BookingHomeView session={session} />;
}
