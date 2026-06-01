import { prisma } from "@/src/lib/prisma"

export interface DashboardItem {
  id: string
  title: string
  description: string | null
  isFavorite: boolean
  isPinned: boolean
  type: { id: string; name: string; icon: string; color: string }
  tags: { id: string; name: string }[]
}

export async function getPinnedItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    include: {
      itemType: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return items.map(mapItem)
}

export async function getRecentItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    include: {
      itemType: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return items.map(mapItem)
}

export interface DashboardStats {
  totalItems: number
  totalCollections: number
  totalTypes: number
  favoriteItems: number
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalItems, totalCollections, totalTypes, favoriteItems] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.count({ where: { isSystem: true } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ])

  return { totalItems, totalCollections, totalTypes, favoriteItems }
}

function mapItem(item: {
  id: string
  title: string
  description: string | null
  isFavorite: boolean
  isPinned: boolean
  itemType: { id: string; name: string; icon: string; color: string }
  tags: { tag: { id: string; name: string } }[]
}): DashboardItem {
  return {
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
  }
}
