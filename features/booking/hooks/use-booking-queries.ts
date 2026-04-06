"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  cancelBooking,
  createBooking,
  getDailySchedule,
  getBookingDetail,
  getBookableResources,
  getHomeOverview,
  getMyBookings,
} from "@/features/booking/api/booking-api";
import { queryKeys } from "@/shared/lib/query-keys";

export function useHomeOverview() {
  return useQuery({
    queryKey: queryKeys.homeOverview,
    queryFn: getHomeOverview,
  });
}

export function useBookableResources() {
  return useQuery({
    queryKey: queryKeys.resources("bookable"),
    queryFn: getBookableResources,
  });
}

export function useDailySchedule(date: string) {
  return useQuery({
    queryKey: queryKeys.dailySchedule(date),
    queryFn: () => getDailySchedule(date),
  });
}

export function useMyBookings(userId: string) {
  return useQuery({
    queryKey: queryKeys.myBookings(userId),
    queryFn: () => getMyBookings(userId),
  });
}

export function useBookingDetail(
  reservationId: string,
  viewerUserId: string,
  viewerRole: "USER" | "ADMIN",
) {
  return useQuery({
    queryKey: queryKeys.reservationDetail(
      reservationId,
      `${viewerRole}:${viewerUserId}`,
    ),
    queryFn: () =>
      getBookingDetail(reservationId, {
        userId: viewerUserId,
        role: viewerRole,
      }),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resources("bookable"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.myBookings(reservation.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.homeOverview,
      });
      queryClient.invalidateQueries({
        queryKey: ["adminReservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dailySchedule"],
      });
      router.push("/my-reservations");
      router.refresh();
    },
  });
}

export function useCancelBooking(
  viewerUserId: string,
  viewerRole: "USER" | "ADMIN",
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) =>
      cancelBooking(reservationId, {
        userId: viewerUserId,
        role: viewerRole,
      }),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.myBookings(viewerUserId),
      });
      queryClient.invalidateQueries({
        queryKey: ["reservationDetail", reservation.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminReservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dailySchedule"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminDashboard,
      });
    },
  });
}
