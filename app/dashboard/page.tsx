import Link from "next/link"
import {
  FileText,
  Heart,
  Pin,
  ArrowRight,
} from "lucide-react"

import { getIcon } from "@/lib/icon-map"
import { getCollections } from "@/src/lib/db/collections"
import { currentUser } from "@/src/lib/mock-data"

export default async function DashboardPage() {
  const collections = await getCollections()

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
            return (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="rounded-lg border border-border border-l-4 p-4 hover:bg-accent/50 transition-colors flex flex-col min-h-[170px]"
                style={col.dominantType ? { borderLeftColor: col.dominantType.color } : undefined}
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
                  {col.types.map((t, i) => {
                    const Icon = getIcon(t.icon)
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

      {/* TODO: Implement pinned items and recent items from database */}
      <section>
        <SectionHeader href="/items?pinned=true" title="Pinned Items" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Placeholder - would fetch pinned items from database */}
          <p className="text-muted-foreground">Loading pinned items...</p>
        </div>
      </section>

      <section>
        <SectionHeader href="/items" title="Recent Items" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Placeholder - would fetch recent items from database */}
          <p className="text-muted-foreground">Loading recent items...</p>
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
