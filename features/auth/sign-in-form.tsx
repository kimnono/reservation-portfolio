"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/common/lib/query-keys";
import { cn } from "@/common/lib/cn";
import { demoAccounts } from "@/features/auth/mock";
import { login } from "@/features/auth/login";
import { getRoleLabel } from "@/features/auth/roles";
import { toAuthenticatedSession } from "@/features/auth/session-api";
import {
  signInSchema,
  type SignInValues,
} from "@/features/auth/sign-in-schema";
import { FormField } from "@/common/components/forms";
import { Button, Card, Input } from "@/common/components/primitives";
import { SectionHeading, StatusBadge } from "@/common/components/patterns";

export function SignInForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: demoAccounts[1]?.email ?? "",
      password: demoAccounts[1]?.password ?? "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setErrorMessage(null);

    const response = await login(values);

    if (!response.ok || !response.data.success || !response.data.data) {
      setErrorMessage(response.data.error?.message ?? "로그인에 실패했습니다.");
      return;
    }

    queryClient.setQueryData(
      queryKeys.session,
      toAuthenticatedSession(response.data.data),
    );

    startTransition(() => {
      router.replace(response.data.redirectTo ?? "/");
      router.refresh();
    });
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.25fr_0.95fr]">
      <Card className="flex flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,114,98,0.2),transparent_42%),linear-gradient(135deg,#0f1d24_0%,#142932_55%,#1a3240_100%)] text-white">
        <div>
          <StatusBadge tone="accent">포트폴리오 로그인</StatusBadge>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
            공용 예약 흐름과 관리자 흐름을 빠르게 확인할 수 있습니다.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-white/74">
            이 화면은 mock 인증 흐름을 테스트하고 사용자 영역과 관리자 영역의
            진입점을 확인하기 위한 시작 화면입니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
            <p className="text-sm text-white/62">사용자 화면</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              예약 생성
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
            <p className="text-sm text-white/62">관리자 화면</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              필터와 상태 변경
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
            <p className="text-sm text-white/62">데이터 흐름</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Query + RHF + Zustand
            </p>
          </div>
        </div>
      </Card>

      <Card className="self-center">
        <SectionHeading
          eyebrow="로그인"
          title="데모 계정으로 바로 시작"
          description="미리 준비된 계정으로 사용자 흐름과 관리자 흐름을 빠르게 확인할 수 있습니다."
        />

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 md:grid-cols-3">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                onClick={() => {
                  setValue("email", account.email);
                  setValue("password", account.password);
                }}
                variant="tile"
                size="tile"
              >
                <p className="text-sm font-semibold">{account.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getRoleLabel(account.role)}
                </p>
              </Button>
            ))}
          </div>

          <FormField label="이메일" error={errors.email?.message}>
            <Input
              {...register("email")}
              className={cn(errors.email && "border-danger")}
              type="email"
              placeholder="minji.kim@timekeeper.dev"
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password?.message}>
            <Input
              {...register("password")}
              className={cn(errors.password && "border-danger")}
              type="password"
              placeholder="timekeeper123"
            />
          </FormField>

          {errorMessage ? (
            <p className="rounded-[20px] border border-danger/20 bg-rose-50 px-4 py-3 text-sm text-danger">
              {errorMessage}
            </p>
          ) : null}

          <Button className="min-w-40" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
