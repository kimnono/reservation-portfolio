import { getSession } from "@/features/auth/session";

export async function GET() {
  const session = await getSession();

  return Response.json({
    authenticated: session.status === "authenticated",
    user: session.user,
  });
}
