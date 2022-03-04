import { walk } from "https://deno.land/std/fs/mod.ts";
import { Location } from "./Location.ts";
import { JD_FILESYSTEM_JD_FILESYSTEM_HOME } from "../constants.ts";
import { sortByLocation } from "./sortByLocation.ts";

const walkOptions = Object.freeze({
  maxDepth: 3, // $JD_JD_FILESYSTEM_HOME/AREA/CATEGORY/ID -> 3
  includeFiles: false,
});

/**
 * Find Filesystem Path from Location
 * @todo Memoize
 */
export async function findPathFromLocation(
  { id, category, area }: Location,
): Promise<string> {
  let match;

  if (id != null) match = [RegExp(`${id.replace(".", "\\.")}`)];
  // - 2-digit category number is not preceded by `.` or `-`
  // - Category number is directly followed by space + name
  else if (category != null) match = [RegExp(`[^.-]${category}\\s[^/]+$`)];
  // Match: `\d\d-\d\d` is directly followed by space + name
  else if (area != null) match = [RegExp(`${area}\\s[^/]+$`)];
  else throw new Error("Invalid Location");

  const walkResults = await walk(JD_FILESYSTEM_HOME, { ...walkOptions, match });
  const path = (await walkResults.next())?.value?.path;
  if (!path) throw new Error("No Location Found");
  return path;
}

export async function findFilesFromName(
  name: string,
): Promise<Array<Deno.DirEntry>> {
  const results: Array<Deno.DirEntry> = [];
  const match = [new RegExp(name, "i")];
  const walkResults = walk(JD_FILESYSTEM_HOME, { ...walkOptions, match });

  for await (const file of walkResults) {
    if (file.name[0] === ".") continue;
    results.push(file);
  }

  return results.sort(sortByLocation);
}
