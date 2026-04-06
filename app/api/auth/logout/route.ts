import { clearSession } from "@/features/auth/api/session";

export async function POST() {
  await clearSession();

  return Response.json({
    success: true,
  });
}
