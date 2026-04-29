"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCancelBooking, useMyBookings } from "@/features/booking/use-booking-queries";
import { Card, Skeleton } from "@/common/components/primitives";
import { EmptyState, SectionHeading, StatusBadge } from "@/common/components/patterns";
import { formatDate, formatTimeRange, getStatusLabel } from "@/common/lib/format";
import { useSessionQuery } from "@/features/auth/use-session-query";

const reservationActionsClassName = "flex flex-wrap gap-3";
const reservationMetaClassName = "mt-2 text-sm text-muted-foreground";

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

export function MyReservationsSection() {
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = useSessionQuery();
  const userId = String(session?.user?.userId ?? "");
  const userRole = session?.user?.role === "ADMIN" ? "ADMIN" : "USER";
  const { data, isLoading } = useMyBookings(userId);
  const cancelMutation = useCancelBooking(userId, userRole);

  useEffect(() => {
    if (!isSessionLoading && !session?.user) {
      router.replace("/auth/sign-in");
    }
  }, [isSessionLoading, router, session?.user]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading
        eyebrow="내 예약"
        title="내 예약 목록"
        description="사용자 전용 화면에서는 본인 예약 조회와 취소에 집중하고, 관리자 화면의 검색과 정렬 기능은 분리했습니다."
      />

      {isSessionLoading || isLoading ? (
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-32"
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="예약 내역이 없습니다."
            description="새 예약을 만들면 이곳에서 상태와 상세 정보를 확인할 수 있습니다."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {data.map((reservation) => {
            const canCancel =
              reservation.status === "PENDING" || reservation.status === "APPROVED";

            return (
              <Card
                key={reservation.id}
                className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={getStatusTone(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </StatusBadge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(reservation.date)} /{" "}
                      {formatTimeRange(reservation.startTime, reservation.endTime)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                    {reservation.title}
                  </h3>
                  <p className={reservationMetaClassName}>
                    {reservation.resourceName}
                  </p>
                </div>

                <div className={reservationActionsClassName}>
                  <Link
                    href={`/reservations/${reservation.id}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                  >
                    상세 보기
                  </Link>
                  <button
                    type="button"
                    disabled={!canCancel || cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate(reservation.id)}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    예약 취소
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
