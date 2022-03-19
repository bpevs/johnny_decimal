import { bold, red } from "../deps.ts";
import { Location } from "../models/location.ts";
import sortByLocationFilename from "./sort_by_location_filename.ts";

const { AREA, CATEGORY, ITEM } = Location.TYPE;
const indent = "  ";

/**
 * @description Just logs a title for CLI output.
 */
export function logTitle(name: string): void {
  console.log(`\n${bold(name)}\n${bold(name.replace(/./g, "="))}`);
}

/**
 * @description
 * Logs a pretty list of filenames, based on their locations.
 * - Sorts by ID, pushing non-JD filenames to the bottom.
 * - Indents based on location, so more specific are more indented.
 */
export function logLocationFilenames(filenames: string[]): void {
  const numMaxIndents = filenames.reduce((prev, name) => {
    const [area, category, item] = prev;
    try {
      const location = new Location({ name, path: "" });
      return [
        area || location.depth === AREA,
        category || location.depth === CATEGORY,
        item || location.depth === ITEM,
      ];
    } catch (e) {
      return prev;
    }
  }, [false, false, false]).filter(Boolean).length;

  const contentsString = filenames
    .sort(sortByLocationFilename)
    .map((name: string) => {
      if (numMaxIndents <= 1) return name;
      if (!Location.isLocationFilename(name)) return red(name);

      const location = new Location({ name, path: "" });
      if (location.depth === AREA) return name;
      if (location.depth === CATEGORY) {
        if (numMaxIndents === 3) return indent + name;
      }
      if (location.depth === ITEM) {
        if (numMaxIndents === 3) return indent + indent + name;
        if (numMaxIndents === 2) return indent + name;
      }
      return name;
    })
    .join("\n");

  console.log(contentsString + "\n");
}
