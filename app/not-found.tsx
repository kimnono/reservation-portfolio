import Link from "next/link";
import { Card } from "@/shared/components/ui";
import { ui } from "@/styles/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
      <Card className="w-full">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
          요청한 화면을 찾지 못했습니다.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          주소가 변경되었거나 더 이상 제공되지 않는 페이지일 수 있습니다.
        </p>
        <Link
          href="/"
          className={`mt-8 inline-flex ${ui.primaryAction}`}
        >
          첫 화면으로 이동
        </Link>
      </Card>
    </main>
  );
}
