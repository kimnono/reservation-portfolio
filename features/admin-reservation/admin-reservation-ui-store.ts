"use client";

import { create } from "zustand";

type AdminReservationUIState = {
  isFilterOpen: boolean;
  selectedReservationId: string | null;
  rejectingReservationId: string | null;
  toggleFilterOpen: () => void;
  setSelectedReservationId: (reservationId: string | null) => void;
  setRejectingReservationId: (reservationId: string | null) => void;
};

export const useAdminReservationUIStore = create<AdminReservationUIState>(
  (set) => ({
    isFilterOpen: true,
    selectedReservationId: null,
    rejectingReservationId: null,
    toggleFilterOpen: () =>
      set((state) => ({ isFilterOpen: !state.isFilterOpen })),
    setSelectedReservationId: (selectedReservationId) =>
      set({ selectedReservationId }),
    setRejectingReservationId: (rejectingReservationId) =>
      set({ rejectingReservationId }),
  }),
);
