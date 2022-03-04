export const regex = {
  area: new RegExp("^[0-9]{2}-[0-9]{2}$"),
  category: new RegExp("^[0-9]{2}$"),
  item: new RegExp("^[0-9]{2}\\.[0-9]{2}$"),

  /**
   * Mostly for matching in Deno.walk
   * Given an unknown ID, match anywhere in the string.
   */
  matchId: (id: string): RegExp => {
    if (isAreaId(id)) return RegExp(id + "\\s[^/]+$");
    if (isCategoryId(id)) return RegExp("[^.-]" + id + "\\s[^/]+$");
    if (isItemId(id)) return RegExp(id.replace(".", "\\."));
    throw new Error("Invalid Location");
  },
};

export const parseId = (str: string = "") => str.split(" ")[0];

/**
 * ID Predicate Functions.
 * Determine whether a string is an ID
 */
export const isAreaId = (str: string) => regex.area.test(str);
export const isCategoryId = (str: string) => regex.category.test(str);
export const isItemId = (str: string) => regex.item.test(str);
export const isLocationId = (str: string) => (
  isAreaId(str) ||
  isCategoryId(str) ||
  isItemId(str)
);

export const isAreaFilename = (str: string) => isAreaId(parseId(str));
export const isCategoryFilename = (str: string) => isCategoryId(parseId(str));
export const isItemFilename = (str: string) => isItemId(parseId(str));
export const isLocationFilename = (str: string) => (
  isAreaFilename(str) ||
  isCategoryFilename(str) ||
  isItemFilename(str)
);
