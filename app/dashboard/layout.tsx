import { getDemoUser, getSidebarData } from "@/src/lib/db/collections"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const demoUser = await getDemoUser()
  if (!demoUser) {
    return (
      <DashboardShell itemTypes={[]} collections={[]} user={null}>
        {children}
      </DashboardShell>
    )
  }

  const data = await getSidebarData(demoUser.id)

  return (
    <DashboardShell
      itemTypes={data.itemTypes}
      collections={data.collections}
      user={{ name: demoUser.name, email: "demo@devstash.io" }}
    >
      {children}
    </DashboardShell>
  )
}
