import type {
  AdminReservationFilter,
  Reservation,
  ReservationListResult,
  ReservationStatus,
} from "@/entities/reservation";
import { mockReservations } from "@/mocks/db/in-memory-db";
import { findResourceById } from "@/mocks/repositories/resource-repository";

function compareStrings(left: string, right: string) {
  return left.localeCompare(right, "ko");
}

function sortReservations(
  reservations: Reservation[],
  sortBy: NonNullable<AdminReservationFilter["sortBy"]>,
  direction: NonNullable<AdminReservationFilter["direction"]>,
) {
  const multiplier = direction === "asc" ? 1 : -1;

  return reservations.sort((left, right) => {
    if (sortBy === "createdAt") {
      return (
        (new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()) *
        multiplier
      );
    }

    if (sortBy === "date") {
      return compareStrings(left.date, right.date) * multiplier;
    }

    return compareStrings(left.userName, right.userName) * multiplier;
  });
}

export function listReservations(filters: AdminReservationFilter = {}): ReservationListResult {
  const page = filters.page ?? 1;
  const size = filters.size ?? 6;
  const sortBy = filters.sortBy ?? "createdAt";
  const direction = filters.direction ?? "desc";

  const filtered = mockReservations.filter((reservation) => {
    if (filters.status && filters.status !== "ALL" && reservation.status !== filters.status) {
      return false;
    }

    if (
      filters.userName &&
      !reservation.userName.toLowerCase().includes(filters.userName.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.resourceName &&
      !reservation.resourceName
        .toLowerCase()
        .includes(filters.resourceName.toLowerCase())
    ) {
      return false;
    }

    if (filters.dateFrom && reservation.date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && reservation.date > filters.dateTo) {
      return false;
    }

    return true;
  });

  const sorted = sortReservations([...filtered], sortBy, direction);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * size;
  const items = sorted.slice(startIndex, startIndex + size);

  return {
    items,
    page: currentPage,
    size,
    total,
    totalPages,
  };
}

export function listReservationsByUser(userId: string) {
  return mockReservations
    .filter((reservation) => reservation.userId === userId)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function listReservationsByDate(date: string) {
  return mockReservations
    .filter(
      (reservation) =>
        reservation.date === date &&
        reservation.status !== "CANCELED" &&
        reservation.status !== "REJECTED",
    )
    .sort((left, right) => left.startTime.localeCompare(right.startTime));
}

export function findReservationById(reservationId: string) {
  return mockReservations.find((reservation) => reservation.id === reservationId) ?? null;
}

export function createReservation(payload: {
  resourceId: string;
  userId: string;
  userName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const resource = findResourceById(payload.resourceId);

  if (!resource || !resource.enabled) {
    throw new Error("예약 가능한 자원이 아닙니다.");
  }

  const hasConflict = mockReservations.some((reservation) => {
    if (
      reservation.resourceId !== payload.resourceId ||
      reservation.date !== payload.date ||
      reservation.status === "CANCELED" ||
      reservation.status === "REJECTED"
    ) {
      return false;
    }

    return !(
      payload.endTime <= reservation.startTime ||
      payload.startTime >= reservation.endTime
    );
  });

  if (hasConflict) {
    throw new Error("같은 시간대에 이미 예약이 존재합니다.");
  }

  const nextReservation: Reservation = {
    id: `rsv-${Date.now()}`,
    resourceId: resource.id,
    resourceName: resource.name,
    userId: payload.userId,
    userName: payload.userName,
    title: payload.title,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  mockReservations.unshift(nextReservation);
  return nextReservation;
}

export function updateReservationStatus(
  reservationId: string,
  payload: {
    status: Exclude<ReservationStatus, "PENDING">;
    rejectReason?: string;
  },
) {
  const target = findReservationById(reservationId);

  if (!target) {
    throw new Error("변경할 예약을 찾지 못했습니다.");
  }

  target.status = payload.status;

  if (payload.status === "REJECTED") {
    target.rejectReason = payload.rejectReason?.trim();
  } else {
    delete target.rejectReason;
  }

  return target;
}

export function cancelReservation(reservationId: string) {
  return updateReservationStatus(reservationId, { status: "CANCELED" });
}
