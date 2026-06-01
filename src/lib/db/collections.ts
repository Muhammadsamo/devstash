import { prisma } from "@/src/lib/prisma"

export interface DashboardCollection {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  itemCount: number
  dominantType: { id: string; name: string; icon: string; color: string } | null
  typeIcons: { name: string; icon: string; color: string }[]
}

export interface DashboardUser {
  id: string
  name: string | null
}

export async function getDashboardCollections(userId: string): Promise<DashboardCollection[]> {
  const collectionsResult = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
  })

  return collectionsResult.map((col) => {
    const items = col.items.map((ic) => ic.item)
    const itemCount = items.length

    const typeMap = new Map<string, { id: string; name: string; icon: string; color: string; count: number }>()
    for (const item of items) {
      const existing = typeMap.get(item.itemTypeId)
      if (existing) {
        existing.count++
      } else {
        typeMap.set(item.itemTypeId, {
          id: item.itemType.id,
          name: item.itemType.name,
          icon: item.itemType.icon,
          color: item.itemType.color,
          count: 1,
        })
      }
    }

    const typeEntries = [...typeMap.values()]
    const dominantType = typeEntries.sort((a, b) => b.count - a.count)[0] ?? null
    const typeIcons = typeEntries.map(({ name, icon, color }) => ({ name, icon, color }))

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount,
      dominantType: dominantType
        ? { id: dominantType.id, name: dominantType.name, icon: dominantType.icon, color: dominantType.color }
        : null,
      typeIcons,
    }
  })
}

export async function getDemoUser(): Promise<DashboardUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true, name: true },
  })
  return user
}
