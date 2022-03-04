import {
  isAreaFilename,
  isCategoryFilename,
  isItemFileName,
  isLocationString,
  regex,
} from "../utilities/predicates.ts";

import {
  getFormattedAreaId,
  getFormattedCategoryId,
  getFormattedItemId,
} from "../utilities/idUtilities.ts";

interface Ids {
  item?: string;
  category?: string;
  area?: string;
}

export enum LocationType {
  AREA = "AREA",
  CATEGORY = "CATEGORY",
  ITEM = "ITEM",
}

interface Parameters {
  path: string;
  id: string;
  name: string;
}

export class Location {
  static readonly TYPE = LocationType;

  readonly area: string;
  readonly name: string;
  readonly path: string;

  readonly category?: string;
  readonly item?: string;

  static regex = regex;

  constructor({ id, name, path }: Parameters) {
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
      this.area = getFormattedCategoryId({ areaId: id });
    } else {
      throw new Error("Invalid Location String");
    }
  }

  get depth(): LocationType {
    if (this.id != null) return Location.TYPE.ID;
    if (this.category != null) return Location.TYPE.CATEGORY;
    if (this.area != null) return Location.TYPE.AREA;
    throw new Error("Location has no area");
  }

  async getContents() {
    console.warn("This getter is not defined.  Please Override.");
  }

  toString = (): string => `${this.id} - ${this.name}`;
}
