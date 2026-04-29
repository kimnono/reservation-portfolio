import type { AdminReservationFilter, ReservationStatus } from "@/entities/reservation";
import { listReservations, updateReservationStatus } from "@/mocks/repositories/reservation-repository";
import { listResources } from "@/mocks/repositories/resource-repository";
import { mockDelay } from "@/common/lib/mock-delay";

export async function getAdminReservations(filters: AdminReservationFilter) {
  await mockDelay();
  return listReservations(filters);
}

export async function getAdminDashboardSummary() {
  await mockDelay();

  const resources = listResources();
  const reservationResult = listReservations({
    status: "ALL",
    page: 1,
    size: 100,
  });

  return {
    totalReservations: reservationResult.total,
    pendingReservations: reservationResult.items.filter(
      (reservation) => reservation.status === "PENDING",
    ).length,
    activeResources: resources.filter((resource) => resource.enabled).length,
    disabledResources: resources.filter((resource) => !resource.enabled).length,
    recentReservations: reservationResult.items.slice(0, 5),
  };
}

export async function changeReservationStatus(
  reservationId: string,
  status: Exclude<ReservationStatus, "PENDING">,
) {
  await mockDelay();
  return updateReservationStatus(reservationId, status);
}
