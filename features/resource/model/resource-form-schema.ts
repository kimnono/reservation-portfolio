import { z } from "zod";

export const resourceFormSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().min(2, "자원 이름을 2자 이상 입력해주세요."),
  type: z.enum(["MEETING_ROOM", "SEAT", "DEVICE"]),
  location: z.string().min(2, "위치를 입력해주세요."),
  capacity: z.coerce.number().min(0).optional(),
  enabled: z.boolean(),
  amenitiesText: z.string().min(1, "편의 정보를 한 개 이상 입력해주세요."),
});

export type ResourceFormInput = z.input<typeof resourceFormSchema>;
export type ResourceFormValues = z.output<typeof resourceFormSchema>;
