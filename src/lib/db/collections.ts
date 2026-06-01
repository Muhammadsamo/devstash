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

export interface DashboardItem {
  id: string
  title: string
  description: string | null
  isFavorite: boolean
  isPinned: boolean
  type: { id: string; name: string; icon: string; color: string }
  tags: { id: string; name: string }[]
}

export interface DashboardUser {
  id: string
  name: string | null
}

export async function getDashboardData(userId: string) {
  const [collectionsResult, pinnedItems, recentItems] = await Promise.all([
    prisma.collection.findMany({
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
    }),

    prisma.item.findMany({
      where: { userId, isPinned: true },
      include: {
        itemType: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),

    prisma.item.findMany({
      where: { userId },
      include: {
        itemType: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const collections: DashboardCollection[] = collectionsResult.map((col) => {
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

  const mapItem = (item: typeof pinnedItems[number]): DashboardItem => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    type: {
      id: item.itemType.id,
      name: item.itemType.name,
      icon: item.itemType.icon,
      color: item.itemType.color,
    },
    tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
  })

  return {
    collections,
    pinnedItems: pinnedItems.map(mapItem),
    recentItems: recentItems.map(mapItem),
  }
}

export async function getDemoUser(): Promise<DashboardUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true, name: true },
  })
  return user
}
