export const publicNavigation = [
  { href: "/", label: "개요" },
  { href: "/reservations", label: "자원" },
  { href: "/reservations/new", label: "예약 생성" },
  { href: "/my-reservations", label: "내 예약" },
  { href: "/auth/sign-in", label: "로그인" },
] as const;

export const adminNavigation = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/reservations", label: "예약" },
  { href: "/admin/resources", label: "자원" },
] as const;
