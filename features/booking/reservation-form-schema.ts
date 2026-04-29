import { z } from "zod";

export const reservationFormSchema = z
  .object({
    resourceId: z.string().min(1, "자원을 선택해주세요."),
    title: z.string().min(2, "예약 제목을 2자 이상 입력해주세요."),
    date: z.string().min(1, "날짜를 선택해주세요."),
    startTime: z.string().min(1, "시작 시간을 선택해주세요."),
    endTime: z.string().min(1, "종료 시간을 선택해주세요."),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: "종료 시간은 시작 시간보다 뒤여야 합니다.",
    path: ["endTime"],
  });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
