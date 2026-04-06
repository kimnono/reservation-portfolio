import type { SignUpRequest, SignUpResponse } from "@/features/auth/model/types";

const SIGN_UP_API_PATH = "/api/auth/signup";

export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
  const response = await fetch(SIGN_UP_API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as SignUpResponse["data"];

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
