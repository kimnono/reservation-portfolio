import { Card, SectionHeading, StatusBadge } from "@/shared/components/ui";
import { getAdminUsers } from "@/features/auth/api/get-admin-users";

export async function AdminUsersSection() {
  const summary = await getAdminUsers();

  return (
    <section className="p-8">
      <SectionHeading
        eyebrow="보조 화면"
        title="사용자 요약"
        description="현재 라우팅에서는 직접 사용하지 않지만 계정 상태를 확인할 수 있도록 최소 요약 UI를 유지합니다."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">전체 계정</p>
          <p className="mt-3 text-3xl font-semibold">{summary.totals.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">활성 계정</p>
          <p className="mt-3 text-3xl font-semibold">{summary.totals.active}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">관리자 계정</p>
          <p className="mt-3 text-3xl font-semibold">{summary.totals.admins}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4">
        {summary.users.map((user) => (
          <Card key={user.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge tone="neutral">{user.role}</StatusBadge>
              <StatusBadge tone={user.status === "active" ? "success" : "danger"}>
                {user.status === "active" ? "활성" : "비활성"}
              </StatusBadge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
