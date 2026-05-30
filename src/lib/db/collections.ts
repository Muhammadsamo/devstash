import { prisma } from "@/lib/prisma";

export type CollectionWithTypes = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  types: Array<{ id: string; name: string; icon: string; color: string }>;
  dominantType: { id: string; name: string; icon: string; color: string } | null;
};

export async function getCollections(): Promise<CollectionWithTypes[]> {
  // Get collections with item count
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      _count: { select: { items: true } },
    },
  });

  if (collections.length === 0) {
    return [];
  }

  // Get the count of items per type per collection
  const itemsByType = await prisma.item.groupBy({
    by: ['collectionId', 'typeId'],
    _count: true,
    where: { collectionId: { in: collections.map(c => c.id) } },
  });

  // Get all types
  const types = await prisma.itemType.findMany();

  // Map the data
  return collections.map((collection) => {
    // Filter the itemsByType for this collection
    const collectionItemsByType = itemsByType.filter(
      (item) => item.collectionId === collection.id
    );

    // Map to types with their counts
    const typesWithCount = collectionItemsByType.map((item) => {
      const type = types.find((t) => t.id === item.typeId);
      return { ...type, count: item._count };
    }).filter(Boolean); // remove if type not found

    // Get the dominant type (the one with the highest count)
    const dominantType = typesWithCount.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );

    // Get the list of types (for icons) - we just need the type details without count
    const typesList = typesWithCount.map(({ count, ...type }) => type);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection._count.items || 0,
      types: typesList,
      dominantType: dominantType ? {
        id: dominantType.id,
        name: dominantType.name,
        icon: dominantType.icon,
        color: dominantType.color,
      } : null,
    };
  });
}