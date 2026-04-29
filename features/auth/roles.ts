export const roles = ["GUEST", "USER", "ADMIN"] as const;

export type Role = (typeof roles)[number];

export function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}

export function getDefaultPathForRole(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "USER":
      return "/reservations";
    default:
      return "/";
  }
}

export function getRoleLabel(role: Role) {
  switch (role) {
    case "ADMIN":
      return "관리자";
    case "USER":
      return "사용자";
    default:
      return "게스트";
  }
}
