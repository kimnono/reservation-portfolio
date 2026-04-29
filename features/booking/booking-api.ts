import type { Reservation } from "@/entities/reservation";
import type { Role } from "@/features/auth/roles";
import {
  cancelReservation,
  createReservation,
  findReservationById,
  listReservationsByDate,
  listReservationsByUser,
} from "@/mocks/repositories/reservation-repository";
import { listResources } from "@/mocks/repositories/resource-repository";
import { mockDelay } from "@/common/lib/mock-delay";

type BookingViewer = {
  userId: string;
  role: Extract<Role, "USER" | "ADMIN">;
};

function assertReservationAccess(
  reservation: Reservation,
  viewer: BookingViewer,
) {
  if (viewer.role === "ADMIN") {
    return;
  }

  if (reservation.userId !== viewer.userId) {
    throw new Error("다른 사용자의 예약에는 접근할 수 없습니다.");
  }
}

export async function getHomeOverview() {
  await mockDelay();

  const resources = listResources();
  const reservations = listReservationsByUser("102");

  return {
    availableResources: resources.filter((resource) => resource.enabled).length,
    pendingApprovals: reservations.filter(
      (reservation) => reservation.status === "PENDING",
    ).length,
    totalResources: resources.length,
    featuredResources: resources.slice(0, 3),
  };
}

export async function getBookableResources() {
  await mockDelay();
  return listResources();
}

export async function createBooking(payload: {
  resourceId: string;
  userId: string;
  userName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  await mockDelay();
  return createReservation(payload);
}

export async function getDailySchedule(date: string) {
  await mockDelay();
  return listReservationsByDate(date);
}

export async function getMyBookings(userId: string) {
  await mockDelay();
  return listReservationsByUser(userId);
}

export async function getBookingDetail(
  reservationId: string,
  viewer: BookingViewer,
) {
  await mockDelay();
  const reservation = findReservationById(reservationId);

  if (!reservation) {
    throw new Error("예약 상세를 찾지 못했습니다.");
  }

  assertReservationAccess(reservation, viewer);
  return reservation;
}

export async function cancelBooking(
  reservationId: string,
  viewer: BookingViewer,
): Promise<Reservation> {
  await mockDelay();
  const reservation = findReservationById(reservationId);

  if (!reservation) {
    throw new Error("취소할 예약을 찾지 못했습니다.");
  }

  assertReservationAccess(reservation, viewer);
  return cancelReservation(reservationId);
}
