import { getSession } from "@/features/auth/api/session";
import { ResourceCatalogSection } from "@/features/booking/ui/resource-catalog-section";

export default async function ReservationsPage() {
  const session = await getSession();

  return <ResourceCatalogSection session={session} />;
}
