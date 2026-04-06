"use client";

import type { AuthSession } from "@/features/auth/api/session";
import { ResourceScheduleBoard } from "@/features/booking/ui/resource-schedule-board";
import { useResources } from "@/features/resource/hooks/use-resource-queries";
import { EmptyState, SectionHeading } from "@/shared/components/ui";

export function AdminScheduleSection({ session }: { session: AuthSession }) {
  const { data, isLoading } = useResources("admin");

  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="운영 스케줄"
        title="자원 스케줄 보드"
        description="관리자 화면에서도 자원별 점유 시간을 보드 형태로 보고, 어느 자원이 언제 비는지 한 번에 파악할 수 있게 구성했습니다."
      />

      {isLoading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-[28px] bg-surface-muted"
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="표시할 자원이 없습니다."
            description="자원 관리 화면에서 자원을 먼저 등록해 주세요."
          />
        </div>
      ) : (
        <ResourceScheduleBoard resources={data} session={session} />
      )}
    </section>
  );
}
