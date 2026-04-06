"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/common/utils/cn";
import type { AuthSession } from "@/features/auth/api/session";
import { getRoleLabel } from "@/features/auth/model/roles";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/features/booking/model/reservation-form-schema";
import {
  useBookableResources,
  useCreateBooking,
} from "@/features/booking/hooks/use-booking-queries";
import { FormField } from "@/shared/components/form-field";
import { Card, SectionHeading, StatusBadge } from "@/shared/components/ui";
import { button } from "@/styles/button";
import { field } from "@/styles/field";

const TIME_OPTIONS = Array.from({ length: 19 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
});
const scheduleInfoClassName =
  "mt-6 rounded-[24px] bg-surface-muted/75 p-4 text-sm text-muted-foreground";
const submitPanelClassName =
  "md:col-span-2 flex items-center justify-between gap-4 rounded-[24px] border border-border bg-surface-muted/60 p-4";
const timeFieldGridClassName = "grid grid-cols-2 gap-4";

type ReservationCreateFormProps = {
  session: AuthSession;
  selectedResourceId?: string;
  selectedDate?: string;
  selectedStartTime?: string;
  selectedEndTime?: string;
};

export function ReservationCreateForm({
  session,
  selectedResourceId,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
}: ReservationCreateFormProps) {
  const { data: resources } = useBookableResources();
  const createBookingMutation = useCreateBooking();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      resourceId: selectedResourceId ?? "",
      title: "",
      date: selectedDate ?? "",
      startTime: selectedStartTime ?? "09:00",
      endTime: selectedEndTime ?? "10:00",
    },
  });

  useEffect(() => {
    if (selectedResourceId) {
      setValue("resourceId", selectedResourceId);
    }
    if (selectedDate) {
      setValue("date", selectedDate);
    }
    if (selectedStartTime) {
      setValue("startTime", selectedStartTime);
    }
    if (selectedEndTime) {
      setValue("endTime", selectedEndTime);
    }
  }, [selectedDate, selectedEndTime, selectedResourceId, selectedStartTime, setValue]);

  const selectedStart = useWatch({ control, name: "startTime" });
  const selectedEnd = useWatch({ control, name: "endTime" });
  const startTimeOptions = TIME_OPTIONS.slice(0, -1);
  const endTimeOptions = TIME_OPTIONS.filter((time) => time > selectedStart);

  useEffect(() => {
    if (selectedEnd <= selectedStart) {
      const nextEndTime = endTimeOptions[0];

      if (nextEndTime) {
        setValue("endTime", nextEndTime);
      }
    }
  }, [endTimeOptions, selectedEnd, selectedStart, setValue]);

  async function onSubmit(values: ReservationFormValues) {
    if (!session.user) {
      return;
    }

    await createBookingMutation.mutateAsync({
      ...values,
      userId: String(session.user.userId),
      userName: session.user.name,
    });
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <Card>
        <SectionHeading
          eyebrow="예약 폼"
          title="예약 생성"
          description="시간은 30분 단위로만 선택되도록 제한해 타임테이블과 같은 규칙으로 예약이 생성되게 맞췄습니다."
        />

        <div className={scheduleInfoClassName}>
          현재 로그인
          <span className="font-semibold text-foreground">
            {" "}
            {session.user?.name} / {session.user ? getRoleLabel(session.user.role) : "게스트"}
          </span>
        </div>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="자원"
            error={errors.resourceId?.message}
            className="md:col-span-2"
          >
            <select
              {...register("resourceId")}
              className={cn(field.input, errors.resourceId && "border-danger")}
            >
              <option value="">자원을 선택해 주세요</option>
              {resources?.filter((resource) => resource.enabled).map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="예약 제목"
            error={errors.title?.message}
            className="md:col-span-2"
          >
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

          <div className={timeFieldGridClassName}>
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

          <div className={submitPanelClassName}>
            <StatusBadge tone="warning">제출 후 목록 갱신</StatusBadge>
            <button
              type="submit"
              disabled={createBookingMutation.isPending}
              className={button.primary}
            >
              {createBookingMutation.isPending ? "생성 중..." : "예약 생성"}
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
}
