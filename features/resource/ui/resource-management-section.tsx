"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ResourceType } from "@/entities/resource/types";
import { useResourceDialogStore } from "@/features/resource/model/resource-dialog-store";
import {
  resourceFormSchema,
  type ResourceFormInput,
  type ResourceFormValues,
} from "@/features/resource/model/resource-form-schema";
import {
  useResources,
  useToggleResource,
  useUpsertResource,
} from "@/features/resource/hooks/use-resource-queries";
import { Card, EmptyState, SectionHeading, StatusBadge } from "@/shared/components/ui";
import { getResourceTypeLabel } from "@/shared/lib/format";
import { ui } from "@/styles/ui";

const resourceActionsClassName = "mt-6 flex flex-wrap gap-3";
const modalFieldClassName =
  "mt-2 w-full rounded-[18px] border border-border bg-background px-3 py-2.5";
const modalFooterClassName = "md:col-span-2 flex justify-end gap-3";

export function ResourceManagementSection() {
  const { data, isLoading } = useResources();
  const upsertMutation = useUpsertResource();
  const toggleMutation = useToggleResource();
  const { isOpen, editingResource, openForCreate, openForEdit, close } =
    useResourceDialogStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceFormInput, undefined, ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      id: null,
      name: "",
      type: "MEETING_ROOM",
      location: "",
      capacity: 4,
      enabled: true,
      amenitiesText: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingResource) {
      reset({
        id: editingResource.id,
        name: editingResource.name,
        type: editingResource.type,
        location: editingResource.location,
        capacity: editingResource.capacity ?? 0,
        enabled: editingResource.enabled,
        amenitiesText: editingResource.amenities.join(", "),
      });
      return;
    }

    reset({
      id: null,
      name: "",
      type: "MEETING_ROOM",
      location: "",
      capacity: 4,
      enabled: true,
      amenitiesText: "",
    });
  }, [editingResource, isOpen, reset]);

  async function onSubmit(values: ResourceFormValues) {
    await upsertMutation.mutateAsync({
      id: values.id,
      name: values.name,
      type: values.type as ResourceType,
      location: values.location,
      capacity: values.capacity,
      enabled: values.enabled,
      amenities: values.amenitiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    close();
  }

  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="자원 관리"
        title="자원 목록과 CRUD 흐름"
        description="목록 조회는 React Query, 모달 열림 상태는 Zustand로 분리했습니다."
        action={
          <button
            type="button"
            onClick={openForCreate}
            className={ui.primaryAction}
          >
            자원 추가
          </button>
        }
      />

      {isLoading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`h-52 ${ui.skeletonBlock}`}
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="등록된 자원이 없습니다."
            description="관리자 화면에서 첫 자원을 추가해 보세요."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {data.map((resource) => (
            <Card key={resource.id}>
              <div className="flex items-center justify-between gap-3">
                <StatusBadge tone={resource.enabled ? "success" : "danger"}>
                  {resource.enabled ? "활성" : "비활성"}
                </StatusBadge>
                <StatusBadge tone="neutral">
                  {getResourceTypeLabel(resource.type)}
                </StatusBadge>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">
                {resource.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
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
              <div className={resourceActionsClassName}>
                <button
                  type="button"
                  onClick={() => openForEdit(resource)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => toggleMutation.mutate(resource.id)}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                >
                  상태 전환
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11222a]/32 p-6">
          <Card className="w-full max-w-2xl">
            <SectionHeading
              eyebrow="자원 폼"
              title={editingResource ? "자원 수정" : "자원 등록"}
              description="입력값은 RHF + Zod로 검증하고 저장 후 관련 query를 invalidate 합니다."
            />
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <label className="block md:col-span-2">
                <span className="text-sm font-medium">이름</span>
                <input
                  {...register("name")}
                  className={modalFieldClassName}
                />
                {errors.name ? (
                  <p className="mt-2 text-sm text-danger">{errors.name.message}</p>
                ) : null}
              </label>
              <label className="block">
                <span className="text-sm font-medium">유형</span>
                <select
                  {...register("type")}
                  className={modalFieldClassName}
                >
                  <option value="MEETING_ROOM">회의실</option>
                  <option value="SEAT">좌석</option>
                  <option value="DEVICE">장비</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">위치</span>
                <input
                  {...register("location")}
                  className={modalFieldClassName}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">수용 인원</span>
                <input
                  {...register("capacity", { valueAsNumber: true })}
                  type="number"
                  className={modalFieldClassName}
                />
              </label>
              <label className="flex items-center gap-3 self-end pb-1">
                <input {...register("enabled")} type="checkbox" />
                <span className="text-sm font-medium">활성 상태</span>
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-medium">편의 정보</span>
                <input
                  {...register("amenitiesText")}
                  className={modalFieldClassName}
                  placeholder="Projector, Whiteboard, Speakerphone"
                />
                {errors.amenitiesText ? (
                  <p className="mt-2 text-sm text-danger">
                    {errors.amenitiesText.message}
                  </p>
                ) : null}
              </label>

              <div className={modalFooterClassName}>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  닫기
                </button>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
                >
                  저장
                </button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
