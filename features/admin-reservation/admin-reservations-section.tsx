"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { AdminReservationFilter, ReservationStatus } from "@/entities/reservation";
import { FormField } from "@/common/components/forms";
import { cn } from "@/common/lib/cn";
import { useAdminReservationUIStore } from "@/features/admin-reservation/admin-reservation-ui-store";
import {
  rejectReservationSchema,
  type RejectReservationFormValues,
} from "@/features/admin-reservation/reject-reservation-schema";
import {
  useAdminReservations,
  useChangeReservationStatus,
} from "@/features/admin-reservation/use-admin-reservation-queries";
import { Button, Card, Textarea } from "@/common/components/primitives";
import { EmptyState, SectionHeading, StatusBadge } from "@/common/components/patterns";
import { formatDate, formatTimeRange, getStatusLabel } from "@/common/lib/format";

const statusTabs = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELED", "COMPLETED"] as const;

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

type RejectReservationFormProps = {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (rejectReason: string) => Promise<void>;
};

function RejectReservationForm({
  isPending,
  onCancel,
  onSubmit,
}: RejectReservationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectReservationFormValues>({
    resolver: zodResolver(rejectReservationSchema),
    defaultValues: {
      rejectReason: "",
    },
  });

  async function handleValidSubmit(values: RejectReservationFormValues) {
    await onSubmit(values.rejectReason);
    reset();
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  return (
    <form
      className="mt-5 rounded-[22px] border border-danger/20 bg-rose-50/70 p-4"
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <FormField label="거절 사유" error={errors.rejectReason?.message}>
        <Textarea
          {...register("rejectReason")}
          className={cn(errors.rejectReason && "border-danger")}
          placeholder="예약을 거절하는 이유를 입력해주세요."
        />
      </FormField>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold"
        >
          취소
        </button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "처리 중..." : "거절 확정"}
        </Button>
      </div>
    </form>
  );
}

export function AdminReservationsSection() {
  const {
    isFilterOpen,
    toggleFilterOpen,
    selectedReservationId,
    setSelectedReservationId,
    rejectingReservationId,
    setRejectingReservationId,
  } = useAdminReservationUIStore();
  const [filters, setFilters] = useState<AdminReservationFilter>({
    status: "ALL",
    sortBy: "createdAt",
    direction: "desc",
    page: 1,
    size: 6,
  });
  const { data, isLoading } = useAdminReservations(filters);
  const changeStatusMutation = useChangeReservationStatus();

  function updateFilter(patch: Partial<AdminReservationFilter>) {
    setFilters((current) => ({
      ...current,
      ...patch,
      page: patch.page ?? 1,
    }));
  }

  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="예약 백오피스"
        title="검색, 필터, 정렬, 페이지네이션"
        description="조건 기반 조회가 핵심인 화면이라 filter 객체 자체를 query key에 포함해 캐시를 분리했습니다."
        action={
          <button
            type="button"
            onClick={toggleFilterOpen}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
          >
            {isFilterOpen ? "필터 닫기" : "필터 열기"}
          </button>
        }
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {statusTabs.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => updateFilter({ status, page: 1 })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filters.status === status
                ? "bg-accent text-accent-foreground"
                : "bg-surface-muted text-muted-foreground"
            }`}
          >
            {status === "ALL" ? "전체" : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {isFilterOpen ? (
        <Card className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="block">
              <span className="text-sm font-medium">예약자명</span>
              <input
                value={filters.userName ?? ""}
                onChange={(event) => updateFilter({ userName: event.target.value })}
                className="mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">자원명</span>
              <input
                value={filters.resourceName ?? ""}
                onChange={(event) => updateFilter({ resourceName: event.target.value })}
                className="mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">시작일</span>
              <input
                type="date"
                value={filters.dateFrom ?? ""}
                onChange={(event) => updateFilter({ dateFrom: event.target.value })}
                className="mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">종료일</span>
              <input
                type="date"
                value={filters.dateTo ?? ""}
                onChange={(event) => updateFilter({ dateTo: event.target.value })}
                className="mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">정렬</span>
              <select
                value={`${filters.sortBy}-${filters.direction}`}
                onChange={(event) => {
                  const [sortBy, direction] = event.target.value.split("-");
                  updateFilter({
                    sortBy: sortBy as AdminReservationFilter["sortBy"],
                    direction: direction as AdminReservationFilter["direction"],
                  });
                }}
                className="mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5"
              >
                <option value="createdAt-desc">생성일 최신순</option>
                <option value="date-asc">예약일 빠른순</option>
                <option value="userName-asc">예약자명 가나다순</option>
              </select>
            </label>
          </div>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[28px] bg-surface-muted"
            />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="조건에 맞는 예약이 없습니다."
            description="검색어 또는 기간 조건을 조정해 주세요."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {data.items.map((reservation) => (
            <Card key={reservation.id}>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge tone={getStatusTone(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </StatusBadge>
                    <span className="text-sm text-muted-foreground">
                      {reservation.userName} / {reservation.resourceName}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                    {reservation.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(reservation.date)} /{" "}
                    {formatTimeRange(reservation.startTime, reservation.endTime)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReservationId(
                        selectedReservationId === reservation.id ? null : reservation.id,
                      )
                    }
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                  >
                    {selectedReservationId === reservation.id ? "상세 닫기" : "상세 열기"}
                  </button>
                  <Link
                    href={`/admin/reservations/${reservation.id}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                  >
                    상세 페이지
                  </Link>
                  {(["APPROVED", "REJECTED", "CANCELED", "COMPLETED"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={changeStatusMutation.isPending}
                      onClick={() => {
                        if (status === "REJECTED") {
                          setRejectingReservationId(
                            rejectingReservationId === reservation.id
                              ? null
                              : reservation.id,
                          );
                          return;
                        }

                        setRejectingReservationId(null);
                        changeStatusMutation.mutate({
                          reservationId: reservation.id,
                          status: status as Exclude<ReservationStatus, "PENDING">,
                        });
                      }}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {rejectingReservationId === reservation.id ? (
                <RejectReservationForm
                  isPending={changeStatusMutation.isPending}
                  onCancel={() => setRejectingReservationId(null)}
                  onSubmit={async (rejectReason) => {
                    await changeStatusMutation.mutateAsync({
                      reservationId: reservation.id,
                      status: "REJECTED",
                      rejectReason,
                    });
                    setRejectingReservationId(null);
                  }}
                />
              ) : null}

              {selectedReservationId === reservation.id ? (
                <div className="mt-6 rounded-[22px] bg-surface-muted/70 p-4 text-sm text-muted-foreground">
                  <p>예약 ID: {reservation.id}</p>
                  <p className="mt-2">예약일: {formatDate(reservation.date)}</p>
                  {reservation.rejectReason ? (
                    <p className="mt-2 text-danger">거절 사유: {reservation.rejectReason}</p>
                  ) : null}
                  <p className="mt-2">
                    조건이 바뀌면 query key가 분리되어 목록 캐시도 함께 갱신됩니다.
                  </p>
                </div>
              ) : null}
            </Card>
          ))}

          <div className="flex items-center justify-between rounded-[24px] border border-border bg-surface px-5 py-4">
            <p className="text-sm text-muted-foreground">
              총 {data.total}건 / {data.page} / {data.totalPages} 페이지
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => updateFilter({ page: data.page - 1 })}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                이전
              </button>
              <button
                type="button"
                disabled={data.page >= data.totalPages}
                onClick={() => updateFilter({ page: data.page + 1 })}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
