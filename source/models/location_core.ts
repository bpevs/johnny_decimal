import {
  getFormattedAreaId,
  getFormattedCategoryId,
  getFormattedItemId,
} from "../utilities/format_id.ts";

import {
  isAreaFilename,
  isAreaId,
  isCategoryFilename,
  isCategoryId,
  isItemFilename,
  isItemId,
  isLocationFilename,
  isLocationId,
  parseId,
  regex,
} from "../utilities/id_utilities.ts";

export enum LocationType {
  AREA = "AREA",
  CATEGORY = "CATEGORY",
  ITEM = "ITEM",
}

/**
 * @description
 * A Location represents a single location in a Johnny Decimal Filesystem.
 * At its core, it is a combination of an areaId, categoryId, and itemId.
 * Since Johnny Decimal organizes locations in a 3-level directory structure,
 * this basically means:
 * - An item will always have an areaId, categoryId, and itemId
 * - A category will always have an areaId and categoryId
 * - An area will always have only an areaId
 *
 * These ids are strings, since there is some overlap (ala itemId "00.00" as an
 * int would  be the same as the categoryid "00")
 *
 * @example
 * const location = new LocationCore({ name: "11.11 MyItem" });
 * location.areaId === "10-19"; // derived from name
 * location.categoryId === "11";// derived from name
 * location.itemId === "11.11";// derived from name
 * location.name === "MyItem";// derived from name
 *
 * @reference https://johnnydecimal.com/concepts/ids/
 */
export class LocationCore {
  static readonly TYPE = LocationType;
  static format = {
    areaId: getFormattedAreaId,
    categoryId: getFormattedCategoryId,
    itemId: getFormattedItemId,
  };
  static regex = regex;
  static parseId = parseId;

  static isAreaId = isAreaId;
  static isCategoryId = isCategoryId;
  static isItemId = isItemId;
  static isLocationId = isLocationId;

  static isAreaFilename = isAreaFilename;
  static isCategoryFilename = isCategoryFilename;
  static isItemFilename = isItemFilename;
  static isLocationFilename = isLocationFilename;

  readonly area: string;
  readonly name: string;
  readonly path: string;

  readonly category?: string;
  readonly item?: string;

  /**
   * @param {string} name - The filename of an item, including id
   * @param {string} path - The full path for locating an item
   * @example new Location({ name: "21.02 MyItem" });
   */
  constructor({ name, path }: {
    name: string;
    path?: string;
  }) {
    const id: string = parseId(name);
    this.name = name;
    this.path = path || "";

    if (isItemId(id)) {
      this.area = getFormattedAreaId({ itemId: id });
      this.category = getFormattedCategoryId({ itemId: id });
      this.item = getFormattedItemId({ itemId: id });
    } else if (isCategoryId(id)) {
      this.area = getFormattedAreaId({ categoryId: id });
      this.category = getFormattedCategoryId({ categoryId: id });
    } else if (isAreaId(id)) {
      this.area = getFormattedAreaId({ areaId: id });
    } else {
      throw new Error("Invalid Location String");
    }
  }

  /**
   * @return Enum describing if a location is an area, category, or item
   */
  get depth(): LocationType {
    if (this.item != null) return LocationCore.TYPE.ITEM;
    if (this.category != null) return LocationCore.TYPE.CATEGORY;
    if (this.area != null) return LocationCore.TYPE.AREA;
    throw new Error("Location has no area");
  }

  /**
   * @return The most specific id used when describing a location
   */
  get id(): string {
    const id = this.item || this.category || this.item;
    if (id) return id;
    throw new Error("No id");
  }

  /**
   * @return String with location's id and name
   */
  toString = (): string => `${this.id} - ${this.name}`;
}
