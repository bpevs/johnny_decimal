export const regex = {
  area: new RegExp("^[0-9]{2}-[0-9]{2}$"),
  category: new RegExp("^[0-9]{2}$"),
  item: new RegExp("^[0-9]{2}\\.[0-9]{2}$"),

  // Match a specific ID, anywhere in the string.
  createFromAreaId: (id: string) => RegExp(id + "\\s[^/]+$"),
  createFromCategoryId: (id: string) => RegExp("[^.-]" + id + "\\s[^/]+$"),
  createFromItemId: (id: string) => RegExp(id.replace(".", "\\.")),
};

export const isAreaId = (str: string) => regex.area.test(str);
export const isCategoryId = (str: string) => regex.category.test(str);
export const isItemId = (str: string) => regex.item.test(str);

export const isAreaFilename = (str: string) => isAreaId(str.split(" ")[0]);
export const isCategoryFilename = (str: string) =>
  isCategoryId(str.split(" ")[0]);
export const isItemFilename = (str: string) => isItemId(str.split(" ")[0]);

export const isAreaPath = (str: string) => "todo";
export const isCategoryPath = (str: string) => "todo";
export const isItemPath = (str: string) => "todo";

export const isLocationId = (str: string) => (
  isAreaId(str) ||
  isCategoryId(str) ||
  isItemId(str)
);

export const isLocationFilename = (str: string) => (
  isAreaFilename(str) ||
  isCategoryFilename(str) ||
  isItemFilename(str)
);

export const getSearchRegex = (id: string): RegExp => {
  if (isAreaId(id)) return regex.createFromAreaId(id);
  if (isCategoryId(id)) return regex.createFromCategoryId(id);
  if (isItemId(id)) return regex.createFromItemId(id);
  throw new Error("Invalid Location");
};
