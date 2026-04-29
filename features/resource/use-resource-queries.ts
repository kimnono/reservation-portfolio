"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Resource } from "@/entities/resource";
import {
  getResources,
  toggleResource,
  upsertResource,
} from "@/features/resource/resource-api";
import { queryKeys } from "@/common/lib/query-keys";

export function useResources(scope = "admin") {
  return useQuery({
    queryKey: queryKeys.resources(scope),
    queryFn: getResources,
  });
}

export function useUpsertResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Resource, "id"> & { id?: string | null }) =>
      upsertResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.homeOverview });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useToggleResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.homeOverview });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}
