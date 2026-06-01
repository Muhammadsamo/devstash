import Link from "next/link"
import { notFound } from "next/navigation"
import { createElement } from "react"
import { prisma } from "@/src/lib/prisma"
import { getDemoUser } from "@/src/lib/db/collections"
import { getIcon } from "@/lib/icon-map"

export default async function ItemTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  const demoUser = await getDemoUser()
  if (!demoUser) {
    return <p className="text-muted-foreground p-8">No demo user found. Run the seed script first.</p>
  }

  const itemType = await prisma.itemType.findFirst({
    where: {
      name: { equals: type, mode: "insensitive" },
      isSystem: true,
    },
  })

  if (!itemType) {
    notFound()
  }

  const items = await prisma.item.findMany({
    where: { userId: demoUser.id, itemTypeId: itemType.id },
    include: {
      itemType: { select: { name: true, icon: true, color: true } },
      tags: { include: { tag: { select: { id: true, name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        {createElement(getIcon(itemType.icon), { className: "h-6 w-6", style: { color: itemType.color } })}
        <h1 className="text-2xl font-bold">{itemType.name}s</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </p>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No {itemType.name.toLowerCase()} items yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const ItemIcon = getIcon(item.itemType.icon)
            return (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors flex items-start gap-3"
              >
                <ItemIcon
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: item.itemType.color }}
                />
                <div className="min-w-0">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {item.tags.map((t) => (
                        <span
                          key={t.tag.id}
                          className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
