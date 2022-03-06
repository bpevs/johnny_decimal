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

  constructor({ id: passedId, name, path }: {
    path: string;
    id?: string;
    name: string;
  }) {
    const id: string = passedId || parseId(name);
    this.name = name;
    this.path = path;

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

  get depth(): LocationType {
    if (this.item != null) return LocationCore.TYPE.ITEM;
    if (this.category != null) return LocationCore.TYPE.CATEGORY;
    if (this.area != null) return LocationCore.TYPE.AREA;
    throw new Error("Location has no area");
  }

  get id(): string {
    const id = this.item || this.category || this.item;
    if (id) return id;
    throw new Error("No id");
  }

  toString = (): string => `${this.id} - ${this.name}`;
}
