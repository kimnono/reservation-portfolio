import { NextResponse, type NextRequest } from "next/server";
import { getDefaultPathForRole, isRole } from "@/features/auth/roles";

const SESSION_COOKIE = "tk_session";
const AUTH_ROUTES = new Set(["/auth/sign-in", "/auth/sign-up"]);
const BASIC_AUTH_ENABLED = process.env.BASIC_AUTH_ENABLED === "true";
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER ?? "";
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD ?? "";

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

function isValidBasicAuth(request: NextRequest) {
  if (!BASIC_AUTH_ENABLED) {
    return true;
  }

  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASSWORD) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  const expected = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;

  return authorization === expected;
}

function basicAuthRequired() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Timekeeper", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isValidBasicAuth(request)) {
    return basicAuthRequired();
  }

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
