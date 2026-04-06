"use client";

import Link from "next/link";
import { useHomeOverview } from "@/features/booking/hooks/use-booking-queries";
import {
  Card,
  EmptyState,
  MetricCard,
  SectionHeading,
  StatusBadge,
} from "@/shared/components/ui";
import { getResourceTypeLabel } from "@/shared/lib/format";
import { ui } from "@/styles/ui";

const heroActionsClassName = "mt-9 flex flex-wrap gap-3";
const resourceMetaClassName = "mt-2 text-sm text-muted-foreground";

export function BookingHomeView() {
  const { data, isLoading } = useHomeOverview();

  if (isLoading || !data) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`h-36 ${ui.skeletonBlock}`}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,114,98,0.18),transparent_36%),linear-gradient(135deg,#ffffff_0%,#eff6f4_100%)]">
        <StatusBadge tone="accent">예약 개요</StatusBadge>
        <div className="mt-7 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div>
            <h1 className="max-w-3xl text-[2.25rem] font-semibold leading-[1.16] tracking-[-0.028em] md:text-[3.15rem] md:leading-[1.1] lg:text-[4.1rem] lg:leading-[1.05]">
              사용자 예약 흐름과 관리자 승인 흐름을 함께 담은 포트폴리오입니다.
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-8 text-muted-foreground md:text-base">
              자원 탐색에서 예약 생성으로 이어지고, 이후 관리자 승인과 자원 운영으로
              연결되는 흐름을 한 프로젝트 안에서 정리했습니다.
            </p>
            <div className={heroActionsClassName}>
              <Link
                href="/reservations/new"
                className={`${ui.primaryAction} shadow-[0_14px_30px_rgba(13,114,98,0.16)]`}
              >
                예약 생성하기
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold"
              >
                관리자 화면 보기
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 lg:pl-1">
            <MetricCard
              label="예약 가능한 자원"
              value={`${data.availableResources}`}
              hint="현재 활성 상태인 자원 수"
            />
            <MetricCard
              label="승인 대기 예약"
              value={`${data.pendingApprovals}`}
              hint="확인 대기 상태 개수"
            />
            <MetricCard
              label="전체 자원"
              value={`${data.totalResources}`}
              hint="회의실, 좌석, 장비 포함"
            />
          </div>
        </div>
      </Card>

      <div className="mt-10">
        <SectionHeading
          eyebrow="대표 자원"
          title="자원 미리 보기"
          description="실제 예약으로 이어질 수 있는 대표 자원을 먼저 보여주고, 이후 생성 화면으로 자연스럽게 이동할 수 있게 구성했습니다."
        />
        {data.featuredResources.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="노출할 자원이 없습니다."
              description="관리자 화면에서 자원을 추가하거나 활성화해 주세요."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.featuredResources.map((resource) => (
              <Card key={resource.id}>
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge tone={resource.enabled ? "success" : "danger"}>
                    {resource.enabled ? "사용 가능" : "비활성"}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {getResourceTypeLabel(resource.type)}
                  </StatusBadge>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">
                  {resource.name}
                </h3>
                <p className={resourceMetaClassName}>
                  {resource.location}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className={ui.tag}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
