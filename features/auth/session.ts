import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getDefaultPathForRole,
  isRole,
  type Role,
} from "@/features/auth/roles";
import type { AuthenticatedUser } from "@/features/auth/types";

const ACCESS_TOKEN_COOKIE = "tk_access_token";
const SESSION_COOKIE = "tk_session";
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 8;

type SessionUser = Omit<AuthenticatedUser, "accessToken">;

export type AuthStatus = "authenticated" | "unauthenticated";

export type AuthSession = {
  status: AuthStatus;
  user: SessionUser | null;
};

function decodeJwtPayload(token: string) {
  try {
    const [, payload = ""] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = Buffer.from(padded, "base64").toString("utf8");

    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
}

function getCookieMaxAge(token: string) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return DEFAULT_COOKIE_MAX_AGE;
  }

  const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
  return remainingSeconds > 0 ? remainingSeconds : DEFAULT_COOKIE_MAX_AGE;
}

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function parseSessionCookie(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as SessionUser;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (
      typeof parsed.userId !== "number" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.role !== "string" ||
      !isRole(parsed.role)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function createSession(user: AuthenticatedUser) {
  const cookieStore = await cookies();
  const maxAge = getCookieMaxAge(user.accessToken);
  const sessionUser: SessionUser = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    user.accessToken,
    getCookieOptions(maxAge),
  );
  cookieStore.set(
    SESSION_COOKIE,
    JSON.stringify(sessionUser),
    getCookieOptions(maxAge),
  );

  return {
    status: "authenticated" as const,
    user: sessionUser,
  };
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const user = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);

  if (!token || !user) {
    return {
      status: "unauthenticated",
      user: null,
    };
  }

  return {
    status: "authenticated",
    user,
  };
}

export async function requireAuth() {
  const session = await getSession();

  if (session.status !== "authenticated" || !session.user) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function requireRole(allowedRoles: Role | Role[]) {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const session = await requireAuth();

  if (!session.user || !allowed.includes(session.user.role)) {
    redirect(session.user ? getDefaultPathForRole(session.user.role) : "/");
  }

  return session;
}

export function getSessionRedirectPath(role: Role) {
  return getDefaultPathForRole(role);
}
