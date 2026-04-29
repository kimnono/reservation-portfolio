import type { LoginRequest, LoginResponse } from "@/features/auth/types";

const LOGIN_API_PATH = "/api/auth/login";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(LOGIN_API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as LoginResponse["data"];

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
