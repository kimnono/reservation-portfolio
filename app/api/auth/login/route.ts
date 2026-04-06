import {
  createSession,
  getSessionRedirectPath,
} from "@/features/auth/api/session";
import { authenticateMockUser } from "@/features/auth/api/mock";
import type { AuthResponseBody, LoginRequest } from "@/features/auth/model/types";

function toErrorBody(message: string): AuthResponseBody {
  return {
    success: false,
    data: null,
    error: {
      code: "AUTH_LOGIN_FAILED",
      message,
    },
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<LoginRequest>;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(toErrorBody("이메일과 비밀번호를 입력해주세요."), {
      status: 400,
    });
  }

  try {
    const user = await authenticateMockUser(email, password);

    await createSession(user);

    return Response.json({
      success: true,
      data: user,
      error: null,
      redirectTo: getSessionRedirectPath(user.role),
    });
  } catch (error) {
    return Response.json(
      toErrorBody(
        error instanceof Error ? error.message : "로그인 처리에 실패했습니다.",
      ),
      {
        status: 401,
      },
    );
  }
}
