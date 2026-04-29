export const queryKeys = {
  session: ["session"] as const,
  homeOverview: ["homeOverview"] as const,
  resourcesRoot: ["resources"] as const,
  resources: (scope: string) => ["resources", scope] as const,
  dailyScheduleRoot: ["dailySchedule"] as const,
  dailySchedule: (date: string) => ["dailySchedule", date] as const,
  reservationDetailRoot: (reservationId: string) =>
    ["reservationDetail", reservationId] as const,
  reservationDetail: (reservationId: string, viewerScope: string) =>
    ["reservationDetail", reservationId, viewerScope] as const,
  myBookings: (userId: string) => ["myBookings", userId] as const,
  adminReservationsRoot: ["adminReservations"] as const,
  adminReservations: (filters: Record<string, unknown>) =>
    ["adminReservations", filters] as const,
  adminDashboard: ["adminDashboard"] as const,
} as const;
