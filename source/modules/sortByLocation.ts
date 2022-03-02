import { Location } from "../modules/Location.ts";

const { isLocationString, isArea, isCategory, isId } = Location;
const { AREA, CATEGORY, ID } = Location.TYPE;

/**
 * Sort used for ordering lists of Locations.
 *
 * Order Parameters:
 *   - Directories outside of the JD naming system are sorted to bottom.
 *   - Containing directories are sorted to top
 *   - Order all locations by number.
 */
export function sortByLocation(a: Deno.DirEntry, b: Deno.DirEntry) {
  // If not a location, sort to bottom.
  const aIsLocation = isLocationString(a.name);
  const bIsLocation = isLocationString(b.name);
  if (aIsLocation && !bIsLocation) return -1;
  if (!aIsLocation && bIsLocation) return 1;
  if (!aIsLocation && !bIsLocation) return a.name.localeCompare(b.name);

  // Sort 1st 2 digits by value
  const aFirstTwo = Number(a.name.substring(0, 2));
  const bFirstTwo = Number(b.name.substring(0, 2));
  const firstTwoSort = aFirstTwo - bFirstTwo;
  if (firstTwoSort) return firstTwoSort;

  // If depth is different, sort by depth
  const aDepth = Location.fromFilename(a.name).depth;
  const bDepth = Location.fromFilename(b.name).depth;
  if (aDepth !== bDepth) {
    if (aDepth === AREA) return -1;
    if (bDepth === AREA) return 1;
    if (aDepth === CATEGORY) return -1;
    if (bDepth === CATEGORY) return 1;
    if (aDepth === ID) return -1;
    if (bDepth === ID) return 1;
  }

  const aLastTwo = Number(a.name.substring(3, 5));
  const bLastTwo = Number(b.name.substring(3, 5));
  if (aLastTwo && bLastTwo === NaN) return -1;
  if (aLastTwo === NaN && bLastTwo) return 1;

  return a.name.localeCompare(b.name);
}
