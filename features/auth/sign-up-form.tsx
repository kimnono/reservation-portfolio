"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "@/common/lib/cn";
import { signUp } from "@/features/auth/sign-up";
import {
  signUpFieldLabels,
  signUpSchema,
  type SignUpValues,
} from "@/features/auth/sign-up-schema";
import { FormField } from "@/common/components/forms";
import { Button, Input } from "@/common/components/primitives";

const defaultValues: SignUpValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    const response = await signUp(values);

    if (!response.ok || !response.data.success || !response.data.data) {
      setErrorMessage(response.data.error?.message ?? "계정 생성에 실패했습니다.");
      return;
    }

    const redirectTo = response.data.redirectTo ?? "/user";

    startTransition(() => {
      router.replace(redirectTo);
      router.refresh();
    });
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl px-6 py-12">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.75fr)]">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_16px_50px_rgba(19,33,26,0.06)]">
          <h1 className="text-3xl font-semibold tracking-tight">계정 만들기</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            가입이 끝나면 바로 로그인된 상태로 공개 예약 화면으로 이동합니다.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <FormField label={signUpFieldLabels.name} error={errors.name?.message}>
              <Input
                {...register("name")}
                className={cn(errors.name && "border-danger")}
                placeholder="이름"
              />
            </FormField>

            <FormField label={signUpFieldLabels.email} error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                className={cn(errors.email && "border-danger")}
                placeholder="you@example.com"
              />
            </FormField>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label={signUpFieldLabels.password}
                error={errors.password?.message}
              >
                <Input
                  {...register("password")}
                  type="password"
                  className={cn(errors.password && "border-danger")}
                  placeholder="8자 이상"
                />
              </FormField>

              <FormField
                label={signUpFieldLabels.confirmPassword}
                error={errors.confirmPassword?.message}
              >
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  className={cn(
                    errors.confirmPassword && "border-danger",
                  )}
                  placeholder="비밀번호 확인"
                />
              </FormField>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "생성 중..." : "계정 만들기"}
            </Button>

            {errorMessage ? (
              <p className="rounded-2xl border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger">
                {errorMessage}
              </p>
            ) : null}
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_16px_50px_rgba(19,33,26,0.06)]">
            <h2 className="text-xl font-semibold tracking-tight">기본 규칙</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>새 계정은 일반 사용자 권한으로 생성됩니다.</li>
              <li>가입 직후 세션이 즉시 생성됩니다.</li>
              <li>관리자 화면은 별도 보호 경로로 유지됩니다.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
