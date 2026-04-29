export const queryKeys = {
  session: ["session"] as const,
  homeOverview: ["homeOverview"] as const,
  resources: (scope: string) => ["resources", scope] as const,
  dailySchedule: (date: string) => ["dailySchedule", date] as const,
  reservationDetail: (reservationId: string, viewerScope: string) =>
    ["reservationDetail", reservationId, viewerScope] as const,
  myBookings: (userId: string) => ["myBookings", userId] as const,
  adminReservations: (filters: Record<string, unknown>) =>
    ["adminReservations", filters] as const,
  adminDashboard: ["adminDashboard"] as const,
} as const;
