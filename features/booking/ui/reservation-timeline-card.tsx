"use client";

import type { CSSProperties } from "react";
import type { Reservation } from "@/entities/reservation/types";
import { StatusBadge } from "@/shared/components/ui";
import { formatTimeRange } from "@/shared/lib/format";

type ReservationTimelineCardProps = {
  reservation: Reservation;
  span: number;
  tone: "warning" | "success" | "danger" | "neutral";
  statusLabel: string;
  variant: "approved" | "request";
  className: string;
  style?: CSSProperties;
};

export function ReservationTimelineCard({
  reservation,
  span,
  tone,
  statusLabel,
  variant,
  className,
  style,
}: ReservationTimelineCardProps) {
  const isMicro = span === 1;
  const isCompact = span <= 2;

  return (
    <div
      className={className}
      style={style}
      aria-label={`${statusLabel} ${formatTimeRange(reservation.startTime, reservation.endTime)} ${reservation.title} ${reservation.userName}`}
    >
      {isMicro ? (
        <>
          <div className="flex items-center justify-between gap-1">
            <StatusBadge tone={tone}>{statusLabel}</StatusBadge>
          </div>
          <div className="mt-2 min-w-0">
            <p className="line-clamp-3 text-xs font-semibold leading-4 text-foreground">
              {reservation.title}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
              {reservation.userName}
            </p>
          </div>
        </>
      ) : isCompact ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <StatusBadge tone={tone}>{statusLabel}</StatusBadge>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {variant === "approved"
                ? formatTimeRange(reservation.startTime, reservation.endTime)
                : reservation.startTime}
            </span>
          </div>
          <div className="mt-3 min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
              {reservation.title}
            </p>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {reservation.userName}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <StatusBadge tone={tone}>{statusLabel}</StatusBadge>
            <span className="text-xs font-semibold text-muted-foreground">
              {formatTimeRange(reservation.startTime, reservation.endTime)}
            </span>
          </div>
          <div className="min-w-0">
            <p
              className={
                variant === "approved"
                  ? "line-clamp-2 break-words text-sm font-semibold leading-[1.35] text-foreground"
                  : "line-clamp-1 text-sm font-semibold text-foreground"
              }
            >
              {reservation.title}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{reservation.userName}</p>
          </div>
        </>
      )}
    </div>
  );
}
