import {
  createSession,
  getSessionRedirectPath,
} from "@/features/auth/session";
import { registerMockUser } from "@/features/auth/mock";
import type { AuthResponseBody, SignUpRequest } from "@/features/auth/types";

function toErrorBody(message: string): AuthResponseBody {
  return {
    success: false,
    data: null,
    error: {
      code: "SIGN_UP_ERROR",
      message,
    },
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SignUpRequest>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return Response.json(
      toErrorBody("이름, 이메일, 비밀번호를 입력해주세요."),
      { status: 400 },
    );
  }

  try {
    const user = await registerMockUser({
      name,
      email,
      password,
    });

    await createSession(user);

    return Response.json(
      {
        success: true,
        data: user,
        error: null,
        redirectTo: getSessionRedirectPath(user.role),
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      toErrorBody(
        error instanceof Error ? error.message : "계정 생성에 실패했습니다.",
      ),
      {
        status: 400,
      },
    );
  }
}
