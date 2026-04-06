"use client";

import type { Resource } from "@/entities/resource/types";
import { create } from "zustand";

type ResourceDialogState = {
  isOpen: boolean;
  editingResource: Resource | null;
  openForCreate: () => void;
  openForEdit: (resource: Resource) => void;
  close: () => void;
};

export const useResourceDialogStore = create<ResourceDialogState>((set) => ({
  isOpen: false,
  editingResource: null,
  openForCreate: () => set({ isOpen: true, editingResource: null }),
  openForEdit: (editingResource) => set({ isOpen: true, editingResource }),
  close: () => set({ isOpen: false, editingResource: null }),
}));
