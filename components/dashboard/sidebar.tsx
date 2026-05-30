"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Star,
  LogOut,
  Folder,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { getIcon } from "@/lib/icon-map"
import { itemTypes, collections, items, currentUser } from "@/src/lib/mock-data"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  isMobileOpen: boolean
  onToggle: () => void
  onMobileClose: () => void
}

const favoriteItems = items.filter((i) => i.isFavorite)
const favoriteColls = collections.filter((c) => c.isFavorite)
const otherColls = collections.filter((c) => !c.isFavorite)

function getCollectionIcon(colId: string) {
  const colItems = items.filter((i) => i.collectionId === colId)
  const typeCount: Record<string, number> = {}
  for (const item of colItems) {
    typeCount[item.typeId] = (typeCount[item.typeId] || 0) + 1
  }
  const topTypeId = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0]
  const itemType = itemTypes.find((t) => t.id === topTypeId)
  return itemType ? getIcon(itemType.icon) : Folder
}

export function Sidebar({ isOpen, isMobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "flex h-full flex-col border-r border-border bg-background transition-all duration-300 shrink-0",
          isOpen ? "w-64" : "w-16",
          "fixed left-0 top-14 z-50 md:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-end border-b border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden md:inline-flex"
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 p-2">
          <div className="space-y-1">
            {isOpen && (
              <p className="text-xs font-semibold text-muted-foreground px-2 pt-2">
                Types
              </p>
            )}
            {itemTypes.map((type) => {
              const Icon = getIcon(type.icon)
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name.toLowerCase()}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors",
                    !isOpen && "justify-center px-0"
                  )}
                  title={!isOpen ? type.name : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                  {isOpen && <span className="truncate">{type.name}</span>}
                </Link>
              )
            })}
          </div>

          {isOpen && (
            <>
              <div className="border-t border-border pt-2">
                <button
                  onClick={() => setCollectionsOpen((p) => !p)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors"
                >
                  {collectionsOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                  Collections
                </button>

                {collectionsOpen && (
                  <div className="mt-1 space-y-0.5">
                    {favoriteColls.map((col) => {
                      const Icon = getCollectionIcon(col.id)
                      return (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 truncate">{col.name}</span>
                          <Heart className="h-3 w-3 shrink-0 fill-current text-red-500" />
                          <span className="text-xs text-muted-foreground">{col.itemCount}</span>
                        </Link>
                      )
                    })}
                    {otherColls.map((col) => {
                      const Icon = getCollectionIcon(col.id)
                      return (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 truncate">{col.name}</span>
                          <span className="text-xs text-muted-foreground">{col.itemCount}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 pb-1 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Favorites
                </p>
                {favoriteItems.map((item) => {
                  const type = itemTypes.find((t) => t.id === item.typeId)
                  const Icon = type ? getIcon(type.icon) : Folder
                  return (
                    <Link
                      key={item.id}
                      href={`/items/${item.id}`}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0"
                        style={type ? { color: type.color } : undefined}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div className={cn(
          "border-t border-border p-3",
          !isOpen && "flex flex-col items-center"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            !isOpen && "flex-col"
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {currentUser.name.charAt(0)}
            </div>
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
