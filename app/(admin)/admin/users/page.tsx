import Link from "next/link";
import { Card, SectionHeading, StatusBadge } from "@/shared/components/ui";

export default function AdminUsersPage() {
  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="보조 화면"
        title="사용자 관리는 현재 축약 상태입니다"
        description="이 프로젝트에서는 예약 흐름과 자원 관리에 더 집중하기 위해 사용자 관리 기능은 요약 수준으로만 남겨 두었습니다."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <StatusBadge tone="warning">포트폴리오 메모</StatusBadge>
          <p className="mt-5 text-lg font-semibold">
            채용 관점에서는 우선순위를 명확히 보여주는 것도 중요합니다.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            이 화면은 사용자 CRUD를 전부 구현하기보다, 핵심 문제였던 예약 생성,
            승인/반려, 자원 상태 관리에 집중했다는 점을 보여주기 위한 placeholder입니다.
          </p>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-foreground">지금 볼 수 있는 영역</p>
          <div className="mt-4 grid gap-3">
            <Link
              href="/admin"
              className="rounded-[20px] border border-border px-4 py-3 text-sm font-semibold transition hover:bg-surface-muted"
            >
              대시보드 보기
            </Link>
            <Link
              href="/admin/reservations"
              className="rounded-[20px] border border-border px-4 py-3 text-sm font-semibold transition hover:bg-surface-muted"
            >
              예약 관리 보기
            </Link>
            <Link
              href="/admin/resources"
              className="rounded-[20px] border border-border px-4 py-3 text-sm font-semibold transition hover:bg-surface-muted"
            >
              자원 관리 보기
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
