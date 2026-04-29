import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth/sign-in-form";
import { getSession } from "@/features/auth/session";
import { getDefaultPathForRole } from "@/features/auth/roles";

export default async function SignInPage() {
  const session = await getSession();

  if (session.status === "authenticated" && session.user) {
    redirect(getDefaultPathForRole(session.user.role));
  }

  return <SignInForm />;
}
