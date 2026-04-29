"use client";

import { Card } from "@/common/components/primitives";
import { MetricCard, SectionHeading, StatusBadge } from "@/common/components/patterns";
import { useAdminDashboardSummary } from "@/features/admin-reservation/use-admin-reservation-queries";
import { formatDate, formatTimeRange, getStatusLabel } from "@/common/lib/format";

function getStatusTone(status: string) {
  switch (status) {
    case "APPROVED":
      return "success" as const;
    case "PENDING":
      return "warning" as const;
    case "REJECTED":
    case "CANCELED":
      return "danger" as const;
    case "COMPLETED":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

export function AdminDashboardSection() {
  const { data, isLoading } = useAdminDashboardSummary();

  if (isLoading || !data) {
    return (
      <div className="p-8">
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-[28px] bg-surface-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="관리자 대시보드"
        title="백오피스 요약"
        description="관리자 업무에서 먼저 확인해야 하는 승인 대기, 전체 예약, 자원 활성 상태를 빠르게 보여줍니다."
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="전체 예약"
          value={`${data.totalReservations}`}
          hint="현재 저장소 기준 총 예약 수"
        />
        <MetricCard
          label="승인 대기"
          value={`${data.pendingReservations}`}
          hint="우선 처리해야 하는 요청"
        />
        <MetricCard
          label="활성 자원"
          value={`${data.activeResources}`}
          hint="예약 가능한 자원 수"
        />
        <MetricCard
          label="비활성 자원"
          value={`${data.disabledResources}`}
          hint="관리자 조정이 필요한 자원"
        />
      </div>

      <div className="mt-8">
        <Card>
          <SectionHeading
            eyebrow="최근 예약"
            title="최신 예약 흐름"
            description="상세 차트 대신 바로 업무에 들어갈 수 있도록 최근 예약 목록을 배치했습니다."
          />
          <div className="mt-6 grid gap-4">
            {data.recentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-[24px] border border-border bg-background/70 p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={getStatusTone(reservation.status)}>
                    {getStatusLabel(reservation.status)}
                  </StatusBadge>
                  <span className="text-sm text-muted-foreground">
                    {reservation.userName} / {reservation.resourceName}
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold">{reservation.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatDate(reservation.date)} /{" "}
                  {formatTimeRange(reservation.startTime, reservation.endTime)}
                </p>
                {reservation.rejectReason ? (
                  <p className="mt-2 text-sm text-danger">
                    거절 사유: {reservation.rejectReason}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
