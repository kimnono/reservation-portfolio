"use client";

import Link from "next/link";
import { useState } from "react";
import type { Resource } from "@/entities/resource/types";
import type { Reservation, ReservationStatus } from "@/entities/reservation/types";
import { useDailySchedule } from "@/features/booking/hooks/use-booking-queries";
import { EmptyState, StatusBadge } from "@/shared/components/ui";
import {
  formatTimeRange,
  getResourceTypeLabel,
  getStatusLabel,
} from "@/shared/lib/format";
import { ui } from "@/styles/ui";

const DAY_START_MINUTES = 9 * 60;
const DAY_END_MINUTES = 18 * 60;
const SLOT_MINUTES = 30;
const SLOT_COUNT = (DAY_END_MINUTES - DAY_START_MINUTES) / SLOT_MINUTES;
const boardPanelClassName =
  "rounded-[28px] border border-border bg-surface/95 p-5 shadow-[0_20px_60px_rgba(8,19,24,0.06)]";
const boardHeaderClassName =
  "flex flex-col gap-4 rounded-[28px] border border-border bg-surface/90 p-5 md:flex-row md:items-center md:justify-between";
const slotHeaderClassName =
  "rounded-[14px] bg-surface-muted/70 px-2 py-2 text-center";
const slotLinkClassName =
  "rounded-[18px] border border-dashed border-border bg-surface-muted/35 p-2 text-left text-[11px] text-muted-foreground transition hover:border-accent hover:bg-accent/6 hover:text-foreground";
const slotBlockClassName =
  "rounded-[18px] border border-dashed border-border bg-surface-muted/30";
const reservationBlockClassName =
  "z-10 rounded-[20px] border border-border/60 bg-white/96 p-3 shadow-[0_12px_24px_rgba(8,19,24,0.08)]";

type ResourceScheduleBoardProps = {
  resources: Resource[];
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

const SLOT_WINDOWS = Array.from({ length: SLOT_COUNT }, (_, index) => {
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

function getBookingHref(resourceId: string, date: string, slot: SlotWindow) {
  const params = new URLSearchParams({
    resourceId,
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
  });

  return `/reservations/new?${params.toString()}`;
}

export function ResourceScheduleBoard({
  resources,
  allowBooking = false,
}: ResourceScheduleBoardProps) {
  const [selectedDate, setSelectedDate] = useState(getDefaultScheduleDate);
  const { data: reservations = [], isLoading } = useDailySchedule(selectedDate);

  if (resources.length === 0) {
    return (
      <EmptyState
        title="표시할 자원이 없습니다."
        description="현재 조건에 맞는 자원이 없어 타임테이블을 그릴 수 없습니다."
      />
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className={boardHeaderClassName}>
        <div>
          <p className="text-sm font-semibold text-foreground">일간 타임테이블</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {allowBooking
              ? "빈 30분 슬롯을 누르면 해당 시간으로 예약 생성 화면이 바로 열립니다."
              : "자원별 당일 점유 현황을 한 화면에서 확인할 수 있습니다."}
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
        const resourceReservations = reservations.filter(
          (reservation) => reservation.resourceId === resource.id,
        );
        const blocks = buildScheduleBlocks(resourceReservations);

        return (
          <div
            key={resource.id}
            className={boardPanelClassName}
          >
            <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={resource.enabled ? "success" : "danger"}>
                    {resource.enabled ? "사용 가능" : "비활성"}
                  </StatusBadge>
                  <StatusBadge tone="neutral">
                    {getResourceTypeLabel(resource.type)}
                  </StatusBadge>
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
                    <span
                      key={amenity}
                      className={ui.tag}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[720px]">
                    <div
                      className="grid gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground"
                      style={{ gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))` }}
                    >
                      {SLOT_WINDOWS.map((slot, index) => (
                        <div
                          key={`${resource.id}-header-${slot.startTime}`}
                          className={slotHeaderClassName}
                        >
                          {index % 2 === 0 ? slot.startTime : slot.endTime}
                        </div>
                      ))}
                    </div>

                    <div
                      className="mt-3 grid auto-rows-[88px] gap-2"
                      style={{ gridTemplateColumns: `repeat(${SLOT_COUNT}, minmax(0, 1fr))` }}
                    >
                      {SLOT_WINDOWS.map((slot, index) => {
                        const href = getBookingHref(resource.id, selectedDate, slot);

                        if (allowBooking && resource.enabled) {
                          return (
                            <Link
                              key={`${resource.id}-slot-${slot.startTime}`}
                              href={href}
                              className={slotLinkClassName}
                              style={{ gridColumn: `${index + 1} / span 1`, gridRow: "1" }}
                            >
                              <span className="block font-semibold text-foreground">
                                {slot.startTime}
                              </span>
                              <span className="mt-1 block">{slot.endTime}</span>
                            </Link>
                          );
                        }

                        return (
                          <div
                            key={`${resource.id}-slot-${slot.startTime}`}
                            className={slotBlockClassName}
                            style={{ gridColumn: `${index + 1} / span 1`, gridRow: "1" }}
                          />
                        );
                      })}

                      {blocks.map(({ reservation, startColumn, span }) => (
                        <div
                          key={reservation.id}
                          className={reservationBlockClassName}
                          style={{
                            gridColumn: `${startColumn} / span ${span}`,
                            gridRow: "1",
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <StatusBadge tone={getStatusTone(reservation.status)}>
                              {getStatusLabel(reservation.status)}
                            </StatusBadge>
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              {formatTimeRange(reservation.startTime, reservation.endTime)}
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-1 text-sm font-semibold text-foreground">
                            {reservation.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {reservation.userName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <p className="mt-4 text-sm text-muted-foreground">스케줄을 불러오는 중입니다.</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
