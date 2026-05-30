import { notFound } from "next/navigation"
import { items, itemTypes } from "@/src/lib/mock-data"

export default async function ItemTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const itemType = itemTypes.find(
    (t) => t.name.toLowerCase() === type.toLowerCase()
  )

  if (!itemType) {
    notFound()
  }

  const filteredItems = items.filter((i) => i.typeId === itemType.id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{itemType.name}s</h1>
      <p className="text-muted-foreground mb-6">
        {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
      </p>

      {filteredItems.length === 0 ? (
        <p className="text-muted-foreground">No {itemType.name.toLowerCase()} items yet.</p>
      ) : (
        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
            >
              <h3 className="font-medium">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
