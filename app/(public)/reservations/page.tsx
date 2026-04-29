import { getSession } from "@/features/auth/session";
import { ResourceCatalogSection } from "@/features/booking/resource-catalog-section";

export default async function ReservationsPage() {
  const session = await getSession();

  return <ResourceCatalogSection session={session} />;
}
