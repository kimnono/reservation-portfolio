export type ReservationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED"
  | "COMPLETED";

export type Reservation = {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  createdAt: string;
};

export type AdminReservationFilter = {
  status?: ReservationStatus | "ALL";
  userName?: string;
  resourceName?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "date" | "userName";
  direction?: "asc" | "desc";
  page?: number;
  size?: number;
};

export type ReservationListResult = {
  items: Reservation[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};
