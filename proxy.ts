import { NextResponse, type NextRequest } from "next/server";
import { getDefaultPathForRole, isRole } from "@/features/auth/model/roles";

const SESSION_COOKIE = "tk_session";
const AUTH_ROUTES = new Set(["/auth/sign-in", "/auth/sign-up"]);

function getSessionRole(request: NextRequest) {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { role?: string };
    return parsed.role && isRole(parsed.role) ? parsed.role : null;
  } catch {
    return null;
  }
}

function requiresAuthenticatedAccess(pathname: string) {
  return (
    pathname === "/my-reservations" ||
    pathname === "/reservations/new" ||
    /^\/reservations\/[^/]+$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getSessionRole(request);

  if (AUTH_ROUTES.has(pathname)) {
    if (role) {
      return NextResponse.redirect(
        new URL(getDefaultPathForRole(role), request.url),
      );
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!role) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(getDefaultPathForRole(role), request.url),
      );
    }
  }

  if (pathname === "/user") {
    return NextResponse.redirect(new URL("/reservations", request.url));
  }

  if (requiresAuthenticatedAccess(pathname) && !role) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user",
    "/my-reservations",
    "/reservations/new",
    "/reservations/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
  ],
};
