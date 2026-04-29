"use client";

import { useState } from "react";
import { cn } from "@/common/lib/cn";
import type { Resource } from "@/entities/resource";
import type { Reservation, ReservationStatus } from "@/entities/reservation";
import type { AuthSession } from "@/features/auth/session";
import { useDailySchedule } from "@/features/booking/use-booking-queries";
import { ReservationCreateDialog } from "@/features/booking/reservation-create-dialog";
import { ReservationTimelineCard } from "@/features/booking/reservation-timeline-card";
import { EmptyState, StatusBadge } from "@/common/components/patterns";
import { Badge } from "@/common/components/primitives";
import { getResourceTypeLabel, getStatusLabel } from "@/common/lib/format";

const DAY_START_MINUTES = 8 * 60;
const DAY_END_MINUTES = 19 * 60;
const SLOT_MINUTES = 60;
const SLOT_COUNT = (DAY_END_MINUTES - DAY_START_MINUTES) / SLOT_MINUTES;

const boardPanelClassName =
  "rounded-[28px] border border-border bg-surface/95 p-5 shadow-[0_20px_60px_rgba(8,19,24,0.06)]";
const boardHeaderClassName =
  "flex flex-col gap-4 rounded-[28px] border border-border bg-surface/90 p-5 md:flex-row md:items-center md:justify-between";
const slotLinkClassName =
  "rounded-[18px] border border-dashed border-border/70 bg-transparent transition hover:border-accent hover:bg-accent/6";
const slotBlockClassName =
  "rounded-[18px] border border-dashed border-border bg-surface-muted/30";
const reservationBlockClassName =
  "z-10 flex h-full min-w-0 flex-col gap-2.5 overflow-hidden rounded-[20px] border border-border/60 bg-white/96 p-3 shadow-[0_8px_16px_rgba(8,19,24,0.06)]";
const requestReservationBlockClassName =
  "z-10 flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-border/70 bg-white/95 px-4 py-3 shadow-[0_8px_16px_rgba(8,19,24,0.05)]";
const collapsedPreviewClassName =
  "group relative overflow-hidden rounded-[24px] border border-border/70 bg-gradient-to-br from-surface to-surface-muted/70 p-5 transition hover:border-accent/60 hover:shadow-[0_18px_45px_rgba(8,19,24,0.08)]";
const timelineBoundaryHeaderClassName =
  "grid gap-2 rounded-[14px] bg-surface-muted/45 px-2 py-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground";

type ResourceScheduleBoardProps = {
  resources: Resource[];
  session: AuthSession;
  allowBooking?: boolean;
};

type SlotWindow = {
  startTime: string;
  endTime: string;
};

type ScheduleBlock = {
  reservation: Reservation;
  startColumn: number;
  span: number;
};

type TimelineLaneBlock = ScheduleBlock & {
  laneIndex: number;
};

type SelectedSlot = {
  resource: Resource;
  date: string;
  startTime: string;
  endTime: string;
};

type ResourceReservationSummary = {
  approvedReservations: Reservation[];
  requestReservations: Reservation[];
  approvedTimelineBlocks: TimelineLaneBlock[];
  requestTimelineBlocks: TimelineLaneBlock[];
  approvedLaneCount: number;
  requestLaneCount: number;
};

type TimelineGridProps = {
  resource: Resource;
  date: string;
  reservations: Reservation[];
  timelineBlocks: TimelineLaneBlock[];
  laneCount: number;
  variant: "approved" | "request";
  allowBooking: boolean;
  onSelectSlot: (slot: SelectedSlot) => void;
};

const SLOT_WINDOWS: SlotWindow[] = Array.from({ length: SLOT_COUNT }, (_, index) => {
  const startMinutes = DAY_START_MINUTES + index * SLOT_MINUTES;
  const endMinutes = startMinutes + SLOT_MINUTES;

  return {
    startTime: toTimeLabel(startMinutes),
    endTime: toTimeLabel(endMinutes),
  };
});

function toTimeLabel(totalMinutes: number) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function getDefaultScheduleDate() {
  const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return nextDay.toISOString().slice(0, 10);
}

function getStatusTone(status: ReservationStatus) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "CANCELED":
      return "neutral";
  }
}

function buildScheduleBlocks(reservations: Reservation[]): ScheduleBlock[] {
  return reservations.map((reservation) => {
    const startColumn =
      Math.max(0, toMinutes(reservation.startTime) - DAY_START_MINUTES) / SLOT_MINUTES + 1;
    const span = Math.max(
      1,
      (toMinutes(reservation.endTime) - toMinutes(reservation.startTime)) / SLOT_MINUTES,
    );

    return {
      reservation,
      startColumn,
      span,
    };
  });
}

function buildTimelineLaneBlocks(reservations: Reservation[]): TimelineLaneBlock[] {
  const sorted = [...reservations].sort((left, right) => {
    const startDiff = toMinutes(left.startTime) - toMinutes(right.startTime);

    if (startDiff !== 0) {
      return startDiff;
    }

    const endDiff = toMinutes(left.endTime) - toMinutes(right.endTime);

    if (endDiff !== 0) {
      return endDiff;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });

  const laneEndTimes: number[] = [];

  return sorted.map((reservation) => {
    const startMinutes = toMinutes(reservation.startTime);
    let laneIndex = laneEndTimes.findIndex((endMinutes) => endMinutes <= startMinutes);

    if (laneIndex === -1) {
      laneIndex = laneEndTimes.length;
      laneEndTimes.push(toMinutes(reservation.endTime));
    } else {
      laneEndTimes[laneIndex] = toMinutes(reservation.endTime);
    }

    const [block] = buildScheduleBlocks([reservation]);

    return {
      ...block,
      laneIndex,
    };
  });
}

function getLaneCount(blocks: TimelineLaneBlock[], minimum = 0) {
  if (blocks.length === 0) {
    return minimum;
  }

  return Math.max(...blocks.map((block) => block.laneIndex)) + 1;
}

function getDayEndLabel() {
  return toTimeLabel(DAY_END_MINUTES);
}

function isSlotOccupied(reservations: Reservation[], slot: SlotWindow) {
  const slotStart = toMinutes(slot.startTime);
  const slotEnd = toMinutes(slot.endTime);

  return reservations.some((reservation) => {
    const reservationStart = toMinutes(reservation.startTime);
    const reservationEnd = toMinutes(reservation.endTime);

    return slotStart < reservationEnd && slotEnd > reservationStart;
  });
}

function summarizeResourceReservations(reservations: Reservation[]): ResourceReservationSummary {
  const approvedReservations = reservations.filter((reservation) => reservation.status === "APPROVED");
  const requestReservations = reservations.filter((reservation) => reservation.status !== "APPROVED");
  const approvedTimelineBlocks = buildTimelineLaneBlocks(approvedReservations);
  const requestTimelineBlocks = buildTimelineLaneBlocks(requestReservations);

  return {
    approvedReservations,
    requestReservations,
    approvedTimelineBlocks,
    requestTimelineBlocks,
    approvedLaneCount: getLaneCount(approvedTimelineBlocks, 1),
    requestLaneCount: getLaneCount(requestTimelineBlocks),
  };
}

function TimelineBoundaryHeader({ resourceId }: { resourceId: string }) {
  return (
    <div
      className={timelineBoundaryHeaderClassName}
      style={{ gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))` }}
    >
      {SLOT_WINDOWS.map((slot, index) => (
        <div
          key={`${resourceId}-boundary-${slot.startTime}`}
          className={cn(
            "flex text-left",
            index === SLOT_WINDOWS.length - 1 ? "justify-between" : "justify-start",
          )}
        >
          <span>{slot.startTime}</span>
          {index === SLOT_WINDOWS.length - 1 ? <span>{getDayEndLabel()}</span> : null}
        </div>
      ))}
    </div>
  );
}

function TimelineGrid({
  resource,
  date,
  reservations,
  timelineBlocks,
  laneCount,
  variant,
  allowBooking,
  onSelectSlot,
}: TimelineGridProps) {
  const rowHeight = variant === "approved" ? "124px" : "96px";
  const cardClassName =
    variant === "approved" ? reservationBlockClassName : requestReservationBlockClassName;

  return (
    <div
      className="mt-3 grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))`,
        gridAutoRows: rowHeight,
      }}
    >
      {Array.from({ length: laneCount }).flatMap((_, laneIndex) =>
        SLOT_WINDOWS.map((slot, index) => {
          const key = `${resource.id}-${variant}-slot-${laneIndex}-${slot.startTime}`;

          if (variant === "approved") {
            const occupied = isSlotOccupied(reservations, slot);

            if (allowBooking && resource.enabled) {
              return (
                <button
                  type="button"
                  key={key}
                  className={cn(
                    slotLinkClassName,
                    occupied && "pointer-events-none border-transparent hover:bg-transparent",
                  )}
                  style={{
                    gridColumn: `${index + 1} / span 1`,
                    gridRow: `${laneIndex + 1}`,
                  }}
                  onClick={() =>
                    onSelectSlot({
                      resource,
                      date,
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                    })
                  }
                  aria-label={`${slot.startTime}부터 ${slot.endTime}까지 예약`}
                />
              );
            }

            return (
              <div
                key={key}
                className={slotBlockClassName}
                style={{
                  gridColumn: `${index + 1} / span 1`,
                  gridRow: `${laneIndex + 1}`,
                }}
              />
            );
          }

          return (
            <div
              key={key}
              className="rounded-[16px] border border-dashed border-border/60 bg-surface-muted/25"
              style={{
                gridColumn: `${index + 1} / span 1`,
                gridRow: `${laneIndex + 1}`,
              }}
            />
          );
        }),
      )}

      {timelineBlocks.map(({ reservation, startColumn, span, laneIndex }) => (
        <ReservationTimelineCard
          key={variant === "approved" ? reservation.id : `${reservation.id}-request-row`}
          reservation={reservation}
          span={span}
          tone={getStatusTone(reservation.status)}
          statusLabel={getStatusLabel(reservation.status)}
          variant={variant}
          className={cardClassName}
          style={{
            gridColumn: `${startColumn} / span ${span}`,
            gridRow: `${laneIndex + 1}`,
          }}
        />
      ))}
    </div>
  );
}

export function ResourceScheduleBoard({
  resources,
  session,
  allowBooking = false,
}: ResourceScheduleBoardProps) {
  const [selectedDate, setSelectedDate] = useState(getDefaultScheduleDate);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);
  const { data: reservations = [], isLoading } = useDailySchedule(selectedDate);

  if (resources.length === 0) {
    return (
      <EmptyState
        title="표시할 자원이 없습니다."
        description="현재 조건에 맞는 자원이 없어 스케줄 보드를 그릴 수 없습니다."
      />
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className={boardHeaderClassName}>
        <div>
          <p className="text-sm font-semibold text-foreground">일간 스케줄 보드</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {allowBooking
              ? "보드를 펼친 뒤 빈 시간을 클릭하면 1시간 단위 예약 팝업이 열립니다."
              : "자원별 하루 일정과 예약 현황을 한 화면에서 확인할 수 있습니다."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-foreground" htmlFor="schedule-date">
            기준 날짜
          </label>
          <input
            id="schedule-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm"
          />
          <StatusBadge tone="neutral">{resources.length}개 자원</StatusBadge>
          <StatusBadge tone="accent">{reservations.length}개 일정</StatusBadge>
        </div>
      </div>

      {resources.map((resource) => {
        const resourceReservations = reservations.filter((reservation) => reservation.resourceId === resource.id);
        const {
          approvedReservations,
          requestReservations,
          approvedTimelineBlocks,
          requestTimelineBlocks,
          approvedLaneCount,
          requestLaneCount,
        } = summarizeResourceReservations(resourceReservations);
        const isExpanded = expandedResourceId === resource.id;

        return (
          <div
            key={resource.id}
            className={cn(
              boardPanelClassName,
              isExpanded
                ? "border-accent/45 bg-white p-7 shadow-[0_28px_70px_rgba(13,114,98,0.16)]"
                : "transition hover:border-border/90",
            )}
          >
            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={resource.enabled ? "success" : "danger"}>
                    {resource.enabled ? "사용 가능" : "비활성"}
                  </StatusBadge>
                  <StatusBadge tone="neutral">{getResourceTypeLabel(resource.type)}</StatusBadge>
                  {isExpanded ? <StatusBadge tone="accent">확장됨</StatusBadge> : null}
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {resource.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{resource.location}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  수용 인원 {resource.capacity ?? 1}명
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resource.amenities.map((amenity) => (
                    <Badge key={amenity} variant="neutral">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                {!isExpanded ? (
                  <button
                    type="button"
                    className={`${collapsedPreviewClassName} w-full text-left`}
                    onClick={() => setExpandedResourceId(resource.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        점유 {approvedReservations.length}건
                      </p>
                      <span className="text-xs font-semibold tracking-[0.14em] text-accent">
                        클릭해 확장
                      </span>
                    </div>

                    <div
                      className="mt-4 grid h-[72px] gap-1.5"
                      style={{ gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))` }}
                    >
                      {SLOT_WINDOWS.map((slot, index) => (
                        <div
                          key={`${resource.id}-collapsed-slot-${slot.startTime}`}
                          className="rounded-[12px] border border-dashed border-border/80 bg-white/70"
                          style={{ gridColumn: `${index + 1} / span 1`, gridRow: "1" }}
                        />
                      ))}

                      {approvedTimelineBlocks.map(({ reservation, startColumn, span }) => (
                        <div
                          key={`${reservation.id}-collapsed`}
                          className="z-10 rounded-[14px] border border-border/60 bg-accent/12 px-2 py-2 text-[11px] font-semibold text-foreground"
                          style={{
                            gridColumn: `${startColumn} / span ${span}`,
                            gridRow: "1",
                          }}
                        >
                          <span className="line-clamp-1 block">{reservation.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                      <span>hover와 클릭으로 시간대를 더 자세히 볼 수 있습니다.</span>
                      <span className="opacity-0 transition group-hover:opacity-100">Expand</span>
                    </div>
                  </button>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">일정 보기</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          확정된 예약은 상단 타임라인에, 요청 상태 예약은 하단에 분리해 표시합니다.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedResourceId(null)}
                        className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
                      >
                        접기
                      </button>
                    </div>

                    <div className="overflow-x-auto pb-2">
                      <div className="min-w-[920px]">
                        <TimelineBoundaryHeader resourceId={resource.id} />
                        <TimelineGrid
                          resource={resource}
                          date={selectedDate}
                          reservations={approvedReservations}
                          timelineBlocks={approvedTimelineBlocks}
                          laneCount={approvedLaneCount}
                          variant="approved"
                          allowBooking={allowBooking}
                          onSelectSlot={setSelectedSlot}
                        />
                      </div>
                    </div>

                    {requestTimelineBlocks.length > 0 ? (
                      <div className="mt-6 border-t border-border/70 pt-5">
                        <p className="text-sm font-semibold text-foreground">요청 상태</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          아직 확정되지 않은 요청은 별도 영역에서 비교해 볼 수 있습니다.
                        </p>
                        <div className="mt-4 overflow-x-auto pb-2">
                          <div className="min-w-[920px]">
                            <TimelineBoundaryHeader resourceId={`${resource.id}-request`} />
                            <TimelineGrid
                              resource={resource}
                              date={selectedDate}
                              reservations={requestReservations}
                              timelineBlocks={requestTimelineBlocks}
                              laneCount={requestLaneCount}
                              variant="request"
                              allowBooking={false}
                              onSelectSlot={setSelectedSlot}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}

                {isLoading ? (
                  <p className="mt-4 text-sm text-muted-foreground">일정을 불러오는 중입니다.</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      <ReservationCreateDialog
        open={selectedSlot !== null}
        session={session}
        resource={selectedSlot?.resource ?? null}
        selectedDate={selectedSlot?.date ?? selectedDate}
        selectedStartTime={selectedSlot?.startTime ?? "08:00"}
        selectedEndTime={selectedSlot?.endTime ?? "09:00"}
        onClose={() => setSelectedSlot(null)}
      />
    </div>
  );
}
