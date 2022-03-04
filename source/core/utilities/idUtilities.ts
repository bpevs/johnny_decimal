export function getFormattedItemId(
  { itemId }: { itemId?: string },
): string {
  return formatItemId(itemId);
}

export function getFormattedCategoryId(
  { itemId, categoryId }: { itemId?: string; categoryId?: string },
): string {
  if (categoryId) return formatCategoryId(Number(categoryId));
  if (itemId) return formatCategoryId(Math.floor(Number(itemId)));
  throw error("getFormattedCategoryId: no id given");
}

export function getFormattedAreaId(
  { itemId, categoryId, areaId }: {
    itemId?: string;
    categoryId?: string;
    areaId?: string;
  },
): string {
  if (areaId) return areaId;
  if (categoryId) return getAreaIdFromCategoryId(Number(categoryId));
  if (itemId) return getAreaIdFromCategoryId(Math.floor(Number(item)));
  throw error("getFormattedAreaId: no id given");
}

function getAreaIdFromCategoryId(category: number): string {
  const start = Math.floor(category / 10) * 10;
  const end = start + 9;
  return `${start}-${end}`;
}

function formatCategoryId(category: number): string {
  return category < 10 ? "0" + category : String(category);
}

function formatItemId(id: number): string {
  return String(id.toFixed(2));
}
