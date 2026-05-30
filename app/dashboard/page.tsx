import Link from "next/link"
import {
  FileText,
  Heart,
  Pin,
  ArrowRight,
} from "lucide-react"

import { getIcon } from "@/lib/icon-map"
import { items, collections, itemTypes, currentUser } from "@/src/lib/mock-data"

function getDominantType(colId: string) {
  const colItems = items.filter((i) => i.collectionId === colId)
  const typeCount: Record<string, number> = {}
  for (const item of colItems) {
    typeCount[item.typeId] = (typeCount[item.typeId] || 0) + 1
  }
  const topId = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0]
  return itemTypes.find((t) => t.id === topId)
}

function getCollectionTypeIcons(colId: string) {
  const colItems = items.filter((i) => i.collectionId === colId)
  const seen = new Set<string>()
  const result: { icon: ReturnType<typeof getIcon>; color: string; name: string }[] = []
  for (const item of colItems) {
    const type = itemTypes.find((t) => t.id === item.typeId)
    if (type && !seen.has(type.id)) {
      seen.add(type.id)
      result.push({ icon: getIcon(type.icon), color: type.color, name: type.name })
    }
  }
  return result
}

const pinnedItems = items.filter((i) => i.isPinned)

const recentItems = [...items]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 10)

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s what&apos;s happening in your stash.
        </p>
      </div>

      <section>
        <SectionHeader href="/collections" title="Collections" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const typeIcons = getCollectionTypeIcons(col.id)
            const dominant = getDominantType(col.id)
            return (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="rounded-lg border border-border border-l-4 p-4 hover:bg-accent/50 transition-colors flex flex-col min-h-[170px]"
                style={dominant ? { borderLeftColor: dominant.color } : undefined}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{col.name}</h3>
                  {col.isFavorite && (
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {col.itemCount} item{col.itemCount !== 1 ? "s" : ""}
                </p>
                {col.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {col.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-3 flex-wrap">
                  {typeIcons.map((t, i) => {
                    const Icon = t.icon
                    return (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        title={t.name}
                      >
                        <Icon className="h-3 w-3" style={{ color: t.color }} />
                        {t.name}
                      </span>
                    )
                  })}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader href="/items?pinned=true" title="Pinned Items" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pinnedItems.map((item) => {
              const type = itemTypes.find((t) => t.id === item.typeId)
              const Icon = type ? getIcon(type.icon) : FileText
              return (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors flex flex-col min-h-[170px]"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={type ? { color: type.color } : undefined}
                    />
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <Pin className="h-3 w-3 shrink-0 text-muted-foreground ml-auto" />
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-1.5 pt-3 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHeader href="/items" title="Recent Items" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentItems.map((item) => {
            const type = itemTypes.find((t) => t.id === item.typeId)
            const Icon = type ? getIcon(type.icon) : FileText
            return (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors flex flex-col min-h-[170px]"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={type ? { color: type.color } : undefined}
                  />
                  <h3 className="font-medium text-sm truncate">{item.title}</h3>
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    {item.isFavorite && (
                      <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                    )}
                    {item.isPinned && (
                      <Pin className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-3 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ href, title }: { href: string; title: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
