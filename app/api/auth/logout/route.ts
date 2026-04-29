import { clearSession } from "@/features/auth/session";

export async function POST() {
  await clearSession();

  return Response.json({
    success: true,
  });
}
