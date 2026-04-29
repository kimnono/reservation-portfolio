"use client";

import { create } from "zustand";

type AdminReservationUIState = {
  isFilterOpen: boolean;
  selectedReservationId: string | null;
  toggleFilterOpen: () => void;
  setSelectedReservationId: (reservationId: string | null) => void;
};

export const useAdminReservationUIStore = create<AdminReservationUIState>(
  (set) => ({
    isFilterOpen: true,
    selectedReservationId: null,
    toggleFilterOpen: () =>
      set((state) => ({ isFilterOpen: !state.isFilterOpen })),
    setSelectedReservationId: (selectedReservationId) =>
      set({ selectedReservationId }),
  }),
);
