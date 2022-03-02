export enum LocationDepth {
  ID = "ID",
  CATEGORY = "CATEGORY",
  AREA = "AREA",
}

export class Location {
  static readonly TYPE = LocationDepth;

  readonly area?: string;
  readonly category?: string;
  readonly id?: string;

  static fromFilename(filename: string) {
    const prefix = filename.split(" ")[0];
    return new Location(prefix);
  }

  static isArea(locationString: string) {
    const prefix = locationString.split(" ")[0];
    return /^[0-9]{2}-[0-9]{2}$/.test(prefix);
  }

  static isCategory(locationString: string) {
    const prefix = locationString.split(" ")[0];
    return /^[0-9]{2}$/.test(prefix);
  }

  static isId(locationString: string) {
    const prefix = locationString.split(" ")[0];
    return /^[0-9]{2}\.[0-9]{2}$/.test(prefix);
  }

  static isLocationString(locationString: string): boolean {
    try {
      Location.fromFilename(locationString);
    } catch (e) {
      return false;
    }
    return true;
  }

  constructor(locationString: string) {
    if (Location.isId(locationString)) {
      const id = Number(locationString);
      const category = Math.floor(id);
      this.id = formatId(id);
      this.category = formatCategory(category);
      this.area = formatAreaFromCategory(category);
    } else if (Location.isCategory(locationString)) {
      const category = Number(locationString);
      this.category = formatCategory(category);
      this.area = formatAreaFromCategory(category);
    } else if (Location.isArea(locationString)) {
      this.area = locationString;
    } else {
      throw new Error("Invalid Location String");
    }
  }

  get pathArray(): string[] {
    const { area, category, id } = this;

    // Since ids and categories can be falsey "0",
    // Check that they are not null or undefined.
    const hasArea = area != null;
    const hasCategory = hasArea && category != null;
    const hasId = hasCategory && id != null;

    if (hasId) return [area, category, id];
    else if (hasCategory) return [area, category];
    else if (hasArea) return [area];
    else throw new Error("Location has no area");
  }

  get depth(): LocationDepth {
    const pathLength = this.pathArray.length;
    if (pathLength === 3) return Location.TYPE.ID;
    if (pathLength === 2) return Location.TYPE.CATEGORY;
    if (pathLength === 1) return Location.TYPE.AREA;
    throw new Error("Location has no area");
  }

  toString = (): string => `[ ${this.pathArray.join(" / ")} ]`;
}

/**
 * Format from number ids (used for building strings) into string ids
 */
function formatAreaFromCategory(category: number): string {
  const start = Math.floor(category / 10) * 10;
  const end = start + 9;
  return `${start}-${end}`;
}

function formatCategory(category: number): string {
  return category < 10 ? "0" + category : String(category);
}

function formatId(id: number): string {
  return String(id.toFixed(2));
}
