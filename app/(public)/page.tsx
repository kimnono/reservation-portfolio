import { BookingHomeView } from "@/features/booking/ui/booking-home-view";
import {getSession} from "@/features/auth/api/session";

const session = await getSession();


export default function HomePage() {
  return <BookingHomeView session={session} />;
}
