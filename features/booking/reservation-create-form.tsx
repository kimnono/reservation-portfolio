"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cn } from "@/common/lib/cn";
import type { AuthSession } from "@/features/auth/session";
import { getRoleLabel } from "@/features/auth/roles";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/features/booking/reservation-form-schema";
import {
  useBookableResources,
  useCreateBooking,
} from "@/features/booking/use-booking-queries";
import { FormField } from "@/common/components/forms";
import { Button, Card, Input, Select } from "@/common/components/primitives";
import { SectionHeading, StatusBadge } from "@/common/components/patterns";

const TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 60;
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
        startTime: selectedStartTime ?? "08:00",
        endTime: selectedEndTime ?? "09:00",
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
          description="시간은 1시간 단위로만 선택되도록 제한해 타임테이블과 같은 규칙으로 예약이 생성되게 맞췄습니다."
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
            <Select
              {...register("resourceId")}
              className={cn(errors.resourceId && "border-danger")}
            >
              <option value="">자원을 선택해 주세요</option>
              {resources?.filter((resource) => resource.enabled).map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="예약 제목"
            error={errors.title?.message}
            className="md:col-span-2"
          >
            <Input
              {...register("title")}
              className={cn(errors.title && "border-danger")}
              placeholder="예: 주간 스프린트 회의"
            />
          </FormField>

          <FormField label="날짜" error={errors.date?.message}>
            <Input
              {...register("date")}
              type="date"
              className={cn(errors.date && "border-danger")}
            />
          </FormField>

          <div className={timeFieldGridClassName}>
            <FormField label="시작 시간">
              <Select {...register("startTime")}>
                {startTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="종료 시간" error={errors.endTime?.message}>
              <Select
                {...register("endTime")}
                className={cn(errors.endTime && "border-danger")}
              >
                {endTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          {createBookingMutation.error ? (
            <p className="md:col-span-2 rounded-[20px] border border-danger/20 bg-rose-50 px-4 py-3 text-sm text-danger">
              {createBookingMutation.error.message}
            </p>
          ) : null}

          <div className={submitPanelClassName}>
            <StatusBadge tone="warning">제출 후 목록 갱신</StatusBadge>
            <Button
              type="submit"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "생성 중..." : "예약 생성"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
