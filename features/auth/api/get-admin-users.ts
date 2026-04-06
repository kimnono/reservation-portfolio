import { getMockAdminUsers } from "@/features/auth/api/mock";

export async function getAdminUsers() {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const users = getMockAdminUsers();

  return {
    users,
    totals: {
      total: users.length,
      active: users.filter((user) => user.status === "active").length,
      admins: users.filter((user) => user.role === "ADMIN").length,
    },
  };
}
