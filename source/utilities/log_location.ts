import { bold, red } from "../deps.ts";
import { Location } from "../models/location.ts";
import { sortByLocation } from "./sort_by_location.ts";

const { AREA, CATEGORY, ITEM } = Location.TYPE;
const indent = "  ";

// @todo: Include containing directories if including deep locations
export function logLocation(name: string, contents: Deno.DirEntry[]) {
  const numDepths = contents.reduce((prev, { name }) => {
    if (!Location.isLocationFilename(name)) return prev;
    const location = new Location({ name, path: "" });
    const [area, category, id] = prev;
    return [
      area || location.depth === AREA,
      category || location.depth === CATEGORY,
      id || location.depth === ITEM,
    ];
  }, [false, false, false]).filter(Boolean).length;

  const contentsString = contents
    .sort(sortByLocation)
    .map(({ name }) => {
      if (numDepths <= 1) return name;
      if (!Location.isLocationFilename(name)) return red(name);

      const location = new Location({ name, path: "" });
      if (location.depth === AREA) return name;
      if (location.depth === CATEGORY) {
        if (numDepths === 3) return indent + name;
      }
      if (location.depth === ITEM) {
        if (numDepths === 3) return indent + indent + name;
        if (numDepths === 2) return indent + name;
      }
      return name;
    })
    .join("\n");

  let str = `\n${bold(name)}\n===\n`;
  str += contentsString;
  str += "\n";
  console.log(str);
}
