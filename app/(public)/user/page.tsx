import Link from "next/link";
import { requireRole } from "@/features/auth/session";
import { Card } from "@/common/components/primitives";
import { SectionHeading, StatusBadge } from "@/common/components/patterns";

export default async function UserPage() {
  const session = await requireRole(["USER", "ADMIN"]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading
        eyebrow="사용자 허브"
        title={`${session.user?.name ?? "사용자"}님, 무엇을 할까요?`}
        description="가입 직후나 로그인 직후에 예약 생성, 자원 탐색, 내 예약 확인 중 어디로 가야 하는지 바로 선택할 수 있도록 허브 화면을 두었습니다."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <StatusBadge tone="accent">빠른 시작</StatusBadge>
          <p className="mt-4 text-xl font-semibold">예약 만들기</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            회의실, 좌석, 장비를 선택해 새로운 예약을 생성합니다.
          </p>
          <Link
            href="/reservations/new"
            className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            예약 생성으로 이동
          </Link>
        </Card>

        <Card>
          <StatusBadge tone="neutral">탐색</StatusBadge>
          <p className="mt-4 text-xl font-semibold">자원 둘러보기</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            현재 사용 가능한 자원을 확인하고 예약 화면으로 이어집니다.
          </p>
          <Link
            href="/reservations"
            className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            자원 목록 보기
          </Link>
        </Card>

        <Card>
          <StatusBadge tone="success">확인</StatusBadge>
          <p className="mt-4 text-xl font-semibold">내 예약 보기</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            생성한 예약의 상태를 확인하고 필요하면 취소할 수 있습니다.
          </p>
          <Link
            href="/my-reservations"
            className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            내 예약 보기
          </Link>
        </Card>
      </div>
    </section>
  );
}
