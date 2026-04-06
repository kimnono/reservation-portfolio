import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth/ui/sign-in-form";
import { getSession } from "@/features/auth/api/session";
import { getDefaultPathForRole } from "@/features/auth/model/roles";

export default async function SignInPage() {
  const session = await getSession();

  if (session.status === "authenticated" && session.user) {
    redirect(getDefaultPathForRole(session.user.role));
  }

  return <SignInForm />;
}
