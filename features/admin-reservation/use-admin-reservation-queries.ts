"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminReservationFilter, ReservationStatus } from "@/entities/reservation";
import {
  changeReservationStatus,
  getAdminDashboardSummary,
  getAdminReservations,
} from "@/features/admin-reservation/admin-reservation-api";
import { queryKeys } from "@/common/lib/query-keys";

export function useAdminReservations(filters: AdminReservationFilter) {
  return useQuery({
    queryKey: queryKeys.adminReservations(filters),
    queryFn: () => getAdminReservations(filters),
  });
}

export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: getAdminDashboardSummary,
  });
}

export function useChangeReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservationId,
      status,
    }: {
      reservationId: string;
      status: Exclude<ReservationStatus, "PENDING">;
    }) => changeReservationStatus(reservationId, status),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({
        queryKey: ["adminReservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reservationDetail", reservation.id],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.myBookings(reservation.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminDashboard,
      });
    },
  });
}
