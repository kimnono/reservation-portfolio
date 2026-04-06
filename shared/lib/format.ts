import type { ReservationStatus } from "@/entities/reservation/types";
import type { ResourceType } from "@/entities/resource/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string) {
  return DATE_FORMATTER.format(new Date(value));
}

export function formatDateTime(value: string) {
  return DATE_TIME_FORMATTER.format(new Date(value));
}

export function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}

export function getStatusLabel(status: ReservationStatus) {
  switch (status) {
    case "PENDING":
      return "승인 대기";
    case "APPROVED":
      return "승인 완료";
    case "REJECTED":
      return "반려";
    case "CANCELED":
      return "취소";
  }
}

export function getResourceTypeLabel(type: ResourceType) {
  switch (type) {
    case "MEETING_ROOM":
      return "회의실";
    case "SEAT":
      return "좌석";
    case "DEVICE":
      return "장비";
  }
}
