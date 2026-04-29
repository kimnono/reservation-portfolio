"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/common/lib/query-keys";
import { fetchSession, SESSION_STALE_TIME } from "@/features/auth/session-api";

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSession,
    staleTime: SESSION_STALE_TIME,
    retry: false,
  });
}
