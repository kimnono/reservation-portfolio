"use client";

import Link from "next/link";
import type { AuthSession } from "@/features/auth/api/session";
import { useBookableResources } from "@/features/booking/hooks/use-booking-queries";
import { ResourceScheduleBoard } from "@/features/booking/ui/resource-schedule-board";
import { EmptyState, SectionHeading } from "@/shared/components/ui";
import { ui } from "@/styles/ui";

export function ResourceCatalogSection({ session }: { session: AuthSession }) {
  const { data, isLoading } = useBookableResources();

  return (
    <section className="mx-auto max-w-8xl px-6 py-10">
      <SectionHeading
        eyebrow="자원 타임테이블"
        title="예약 가능한 자원"
        description="단순 카드 나열 대신 자원별 점유 현황과 빈 시간 슬롯을 함께 보여주고, 바로 예약까지 이어지도록 구성했습니다."
        action={
          <Link
            href="/reservations/new"
            className={ui.primaryAction}
          >
            직접 예약하기
          </Link>
        }
      />

      {isLoading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`h-64 ${ui.skeletonBlock}`}
            />
          ))}
        </div>
      ) : !data || data.filter((resource) => resource.enabled).length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="예약 가능한 자원이 없습니다."
            description="관리자 자원 관리 화면에서 자원을 먼저 활성화해 주세요."
          />
        </div>
      ) : (
        <ResourceScheduleBoard
          resources={data.filter((resource) => resource.enabled)}
          session={session}
          allowBooking
        />
      )}
    </section>
  );
}
