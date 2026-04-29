import { z } from "zod";

export const rejectReservationSchema = z.object({
  rejectReason: z
    .string()
    .trim()
    .min(2, "거절 사유를 2자 이상 입력해주세요.")
    .max(300, "거절 사유는 300자 이하로 입력해주세요."),
});

export type RejectReservationFormValues = z.infer<typeof rejectReservationSchema>;
