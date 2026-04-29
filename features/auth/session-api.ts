import type { AuthSession } from "@/features/auth/session";
import type { AuthenticatedUser } from "@/features/auth/types";

type SessionResponse = {
  authenticated: boolean;
  user: AuthSession["user"];
};

export const SESSION_STALE_TIME = 5 * 60_000;

export function toUnauthenticatedSession(): AuthSession {
  return {
    status: "unauthenticated",
    user: null,
  };
}

export function toAuthenticatedSession(user: AuthenticatedUser): AuthSession {
  return {
    status: "authenticated",
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function fetchSession(): Promise<AuthSession> {
  const response = await fetch("/api/auth/session", {
    credentials: "same-origin",
  });

  if (!response.ok) {
    return toUnauthenticatedSession();
  }

  const session = (await response.json()) as SessionResponse;

  return {
    status: session.authenticated ? "authenticated" : "unauthenticated",
    user: session.authenticated ? session.user : null,
  };
}
