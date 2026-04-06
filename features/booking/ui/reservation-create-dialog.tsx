"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/common/utils/cn";
import type { Resource } from "@/entities/resource/types";
import type { AuthSession } from "@/features/auth/api/session";
import { getRoleLabel } from "@/features/auth/model/roles";
import { useCreateBooking } from "@/features/booking/hooks/use-booking-queries";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/features/booking/model/reservation-form-schema";
import { FormField } from "@/shared/components/form-field";
import { Card, StatusBadge } from "@/shared/components/ui";
import { button } from "@/styles/button";
import { field } from "@/styles/field";

type ReservationCreateDialogProps = {
  open: boolean;
  session: AuthSession;
  resource: Resource | null;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  onClose: () => void;
};

const TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 60;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
});

export function ReservationCreateDialog({
  open,
  session,
  resource,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onClose,
}: ReservationCreateDialogProps) {
  const createBookingMutation = useCreateBooking({ redirectToMyReservations: false });
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      resourceId: resource?.id ?? "",
      title: "",
      date: selectedDate,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    },
  });

  const selectedStart = useWatch({ control, name: "startTime" });
  const selectedEnd = useWatch({ control, name: "endTime" });
  const startTimeOptions = TIME_OPTIONS.slice(0, -1);
  const endTimeOptions = TIME_OPTIONS.filter((time) => time > selectedStart);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      resourceId: resource?.id ?? "",
      title: "",
      date: selectedDate,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    });
  }, [open, resource?.id, reset, selectedDate, selectedEndTime, selectedStartTime]);

  useEffect(() => {
    if (selectedEnd <= selectedStart) {
      const nextEndTime = endTimeOptions[0];

      if (nextEndTime) {
        setValue("endTime", nextEndTime);
      }
    }
  }, [endTimeOptions, selectedEnd, selectedStart, setValue]);

  if (!open || !resource) {
    return null;
  }

  async function onSubmit(values: ReservationFormValues) {
    if (!session.user) {
      return;
    }

    await createBookingMutation.mutateAsync({
      ...values,
      userId: String(session.user.userId),
      userName: session.user.name,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={() => {
          if (!createBookingMutation.isPending) {
            onClose();
          }
        }}
      />
      <Card className="relative z-10 w-full max-w-2xl p-0">
        <div className="border-b border-border/70 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Reservation
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                예약 생성
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {resource.name} · {selectedDate} · {selectedStartTime} - {selectedEndTime}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={createBookingMutation.isPending}
              className="rounded-full border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-[24px] bg-surface-muted/75 p-4 text-sm text-muted-foreground">
            현재 로그인
            <span className="font-semibold text-foreground">
              {" "}
              {session.user?.name} / {session.user ? getRoleLabel(session.user.role) : "게스트"}
            </span>
          </div>

          <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("resourceId")} type="hidden" />

            <FormField label="자원" className="md:col-span-2">
              <input value={resource.name} disabled className={cn(field.input, "opacity-80")} />
            </FormField>

            <FormField label="예약 제목" error={errors.title?.message} className="md:col-span-2">
              <input
                {...register("title")}
                className={cn(field.input, errors.title && "border-danger")}
                placeholder="예: 주간 스프린트 회의"
              />
            </FormField>

            <FormField label="날짜" error={errors.date?.message}>
              <input
                {...register("date")}
                type="date"
                className={cn(field.input, errors.date && "border-danger")}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="시작 시간">
                <select {...register("startTime")} className={field.input}>
                  {startTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="종료 시간" error={errors.endTime?.message}>
                <select
                  {...register("endTime")}
                  className={cn(field.input, errors.endTime && "border-danger")}
                >
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {createBookingMutation.error ? (
              <p className="md:col-span-2 rounded-[20px] border border-danger/20 bg-rose-50 px-4 py-3 text-sm text-danger">
                {createBookingMutation.error.message}
              </p>
            ) : null}

            <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-[24px] border border-border bg-surface-muted/60 p-4">
              <StatusBadge tone="warning">1시간 단위로 예약됩니다</StatusBadge>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={createBookingMutation.isPending}
                  className={button.ghost}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createBookingMutation.isPending}
                  className={button.primary}
                >
                  {createBookingMutation.isPending ? "생성 중..." : "예약 생성"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
