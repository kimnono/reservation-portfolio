"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/common/lib/query-keys";
import { login } from "@/features/auth/login";
import { signUp } from "@/features/auth/sign-up";
import {
  logout,
  toAuthenticatedSession,
  toUnauthenticatedSession,
} from "@/features/auth/session-api";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (!response.ok || !response.data.success || !response.data.data) {
        return;
      }

      queryClient.setQueryData(
        queryKeys.session,
        toAuthenticatedSession(response.data.data),
      );
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      if (!response.ok || !response.data.success || !response.data.data) {
        return;
      }

      queryClient.setQueryData(
        queryKeys.session,
        toAuthenticatedSession(response.data.data),
      );
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData(queryKeys.session, toUnauthenticatedSession());
    },
  });
}
