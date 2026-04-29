import type { Role } from "@/features/auth/roles";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthError = {
  code: string;
  message: string;
};

export type AuthenticatedUser = {
  userId: number;
  name: string;
  email: string;
  role: Exclude<Role, "GUEST">;
  accessToken: string;
};

export type AuthResponseBody = {
  success: boolean;
  data: AuthenticatedUser | null;
  error: AuthError | null;
};

export type LoginResponse = {
  status: number;
  ok: boolean;
  data: AuthResponseBody & {
    redirectTo?: string;
  };
};

export type SignUpResponse = {
  status: number;
  ok: boolean;
  data: AuthResponseBody & {
    redirectTo?: string;
  };
};
