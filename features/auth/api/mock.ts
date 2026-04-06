import type { Role } from "@/features/auth/model/roles";
import type { AuthenticatedUser } from "@/features/auth/model/types";

type MockAuthUserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "GUEST">;
  status: "active" | "inactive";
};

type AdminUserSummary = {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, "GUEST">;
  status: "active" | "inactive";
};

const mockAuthUsers: MockAuthUserRecord[] = [
  {
    id: 101,
    name: "Mina Park",
    email: "mina@timekeeper.dev",
    password: "timekeeper123",
    role: "ADMIN",
    status: "active",
  },
  {
    id: 102,
    name: "Minji Kim",
    email: "minji.kim@timekeeper.dev",
    password: "timekeeper123",
    role: "USER",
    status: "active",
  },
  {
    id: 103,
    name: "Jisoo Kim",
    email: "jisoo@timekeeper.dev",
    password: "timekeeper123",
    role: "USER",
    status: "active",
  },
];

export const demoAccounts = mockAuthUsers.map((user) => ({
  email: user.email,
  password: user.password,
  role: user.role,
  name: user.name,
}));

function createAccessToken(email: string) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url",
  );
  const payload = Buffer.from(
    JSON.stringify({
      sub: email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    }),
  ).toString("base64url");

  return `${header}.${payload}.mock-signature`;
}

function toAuthenticatedUser(user: MockAuthUserRecord): AuthenticatedUser {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken: createAccessToken(user.email),
  };
}

function findUserByEmail(email: string) {
  return (
    mockAuthUsers.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    ) ?? null
  );
}

export async function authenticateMockUser(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const user = findUserByEmail(email);

  if (!user) {
    throw new Error("일치하는 계정을 찾지 못했습니다.");
  }

  if (user.password !== password) {
    throw new Error("비밀번호가 올바르지 않습니다.");
  }

  if (user.status !== "active") {
    throw new Error("비활성화된 계정입니다.");
  }

  return toAuthenticatedUser(user);
}

export async function registerMockUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (findUserByEmail(input.email)) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const nextUser: MockAuthUserRecord = {
    id: Date.now(),
    name: input.name,
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: "USER",
    status: "active",
  };

  mockAuthUsers.push(nextUser);
  return toAuthenticatedUser(nextUser);
}

export function getMockAdminUsers(): AdminUserSummary[] {
  return mockAuthUsers.map((user) => ({
    id: `user-${user.id}`,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }));
}
