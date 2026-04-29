"use client";

import { useCancelBooking, useBookingDetail } from "@/features/booking/use-booking-queries";
import { Button, Card, Skeleton } from "@/common/components/primitives";
import { SectionHeading, StatusBadge } from "@/common/components/patterns";
import {
  formatDate,
  formatDateTime,
  formatTimeRange,
  getStatusLabel,
} from "@/common/lib/format";

type ReservationDetailSectionProps = {
  reservationId: string;
  viewerUserId: string;
  viewerRole: "USER" | "ADMIN";
};

function getStatusTone(status: string) {
  switch (status) {
    case "APPROVED":
      return "success" as const;
    case "PENDING":
      return "warning" as const;
    case "REJECTED":
    case "CANCELED":
      return "danger" as const;
    default:
      return "neutral" as const;
  }
}

export function ReservationDetailSection({
  reservationId,
  viewerUserId,
  viewerRole,
}: ReservationDetailSectionProps) {
  const { data, isLoading } = useBookingDetail(
    reservationId,
    viewerUserId,
    viewerRole,
  );
  const cancelMutation = useCancelBooking(viewerUserId, viewerRole);

  if (isLoading || !data) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Skeleton className="h-80" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Card>
        <SectionHeading
          eyebrow="예약 상세"
          title={data.title}
          description="상세 조회는 별도 query key로 분리해 목록 캐시와 독립적으로 관리합니다."
          action={
            <StatusBadge tone={getStatusTone(data.status)}>
              {getStatusLabel(data.status)}
            </StatusBadge>
          }
        />

        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] bg-surface-muted/70 p-4">
            <dt className="text-sm text-muted-foreground">자원</dt>
            <dd className="mt-2 text-lg font-semibold">{data.resourceName}</dd>
          </div>
          <div className="rounded-[22px] bg-surface-muted/70 p-4">
            <dt className="text-sm text-muted-foreground">예약자</dt>
            <dd className="mt-2 text-lg font-semibold">{data.userName}</dd>
          </div>
          <div className="rounded-[22px] bg-surface-muted/70 p-4">
            <dt className="text-sm text-muted-foreground">일정</dt>
            <dd className="mt-2 text-lg font-semibold">
              {formatDate(data.date)} / {formatTimeRange(data.startTime, data.endTime)}
            </dd>
          </div>
          <div className="rounded-[22px] bg-surface-muted/70 p-4">
            <dt className="text-sm text-muted-foreground">생성 시각</dt>
            <dd className="mt-2 text-lg font-semibold">
              {formatDateTime(data.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <Button
            type="button"
            disabled={
              cancelMutation.isPending ||
              (data.status !== "PENDING" && data.status !== "APPROVED")
            }
            onClick={() => cancelMutation.mutate(data.id)}
          >
            예약 취소
          </Button>
        </div>
      </Card>
    </section>
  );
}
