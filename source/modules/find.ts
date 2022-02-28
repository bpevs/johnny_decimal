import { walk } from "https://deno.land/std@0.127.0/fs/mod.ts";
import { Location } from "./Location.ts";
import { getHome } from "./environment.ts";

const walkOptions = Object.freeze({
  maxDepth: 3, // $JD_HOME/AREA/CATEGORY/ID -> 3
  includeFiles: false,
});

/**
 * Find Filesystem Path from Location
 * @todo Memoize
 */
export async function findPathFromLocation(location: Location) {
  const home = getHome();
  if (!home) return;

  const { id, category, area } = location;

  if (id != null) {
    const matchDirStartingWithId = `${id.replace(".", "\\.")}`;
    const match = [RegExp(matchDirStartingWithId)];
    return (await walk(home, { ...walkOptions, match })).next();
  } else if (category != null) {
    // Match:
    //   - 2-digit category number is not preceded by `.` or `-`
    //   - Category number is directly followed by space + name
    const matchDirStartingWithCategory = `[^.-]${category}\\s[a-zA-Z]+$`;
    const match = [RegExp(matchDirStartingWithCategory)];
    return (walk(home, { ...walkOptions, match })).next();
  } else if (area != null) {
    // Match: `\d\d-\d\d` is directly followed by space + name
    const matchDirStartingWithArea = `${area}\\s[a-zA-Z]+$`;
    const match = [RegExp(matchDirStartingWithArea)];
    return (walk(home, { ...walkOptions, match })).next();
  }
}
