export const regex = {
  area: new RegExp("^[0-9]{2}-[0-9]{2}$"),
  category: new RegExp("^[0-9]{2}$"),
  item: new RegExp("^[0-9]{2}\\.[0-9]{2}$"),

  /**
   * @description
   * Mostly for matching in Deno.walk
   * Given an unknown ID, match anywhere in the string.
   * @param id - any area, category, or item id
   */
  matchId: (id: string): RegExp => {
    if (isAreaId(id)) return RegExp(id + "\\s[^/]+$");
    if (isCategoryId(id)) return RegExp("[^.-]" + id + "\\s[^/]+$");
    if (isItemId(id)) return RegExp(id.replace(".", "\\."));
    throw new Error("Invalid Location");
  },
};

/**
 * @description parse the id from a string. Meant for use in names, NOT paths.
 * @param str - any string
 */
export const parseId = (str = ""): string => {
  const id = str.split(" ")[0];
  if (
    regex.area.test(id) ||
    regex.category.test(id) ||
    regex.item.test(id)
  ) {
    return id;
  }
  return "";
};

/** @description describes whether a string is an areaId (ex: 10-19) */
export const isAreaId = (str: string) => regex.area.test(str);

/** @description describes whether a string is an categoryId (ex: 10) */
export const isCategoryId = (str: string) => regex.category.test(str);

/** @description describes whether a string is an itemId (ex: 10.10) */
export const isItemId = (str: string) => regex.item.test(str);

/** @description describes whether a string is any kind of JD id */
export const isLocationId = (str: string) => (
  isAreaId(str) ||
  isCategoryId(str) ||
  isItemId(str)
);

/** @description describes whether a filename is an areaId (ex: 10-19 MyArea) */
export const isAreaFilename = (str: string) => isAreaId(parseId(str));

/** @description describes whether a filename is an categoryId (ex: 10 MyCat) */
export const isCategoryFilename = (str: string) => isCategoryId(parseId(str));

/** @description describes whether a filename is an itemId (ex: 10.10 MyItem) */
export const isItemFilename = (str: string) => isItemId(parseId(str));

/** @description describes whether a filename is any kind of JD id */
export const isLocationFilename = (str: string) => (
  isAreaFilename(str) ||
  isCategoryFilename(str) ||
  isItemFilename(str)
);
