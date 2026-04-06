"use client";

import { Card } from "@/shared/components/ui";
import { ui } from "@/styles/ui";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
          <Card className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-danger">
              전역 오류
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
              애플리케이션 초기화 중 오류가 발생했습니다.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {error.message}
            </p>
            <button
              type="button"
              onClick={reset}
              className={`mt-8 inline-flex ${ui.primaryAction}`}
            >
              다시 시도
            </button>
          </Card>
        </main>
      </body>
    </html>
  );
}
