import { Location } from "../models/location.ts";

const { AREA, CATEGORY, ITEM } = Location.TYPE;

/**
 * Sort used for ordering lists of Locations.
 *
 * Order Parameters:
 *   - Directories outside of the JD naming system are sorted to bottom.
 *   - Containing directories are sorted to top
 *   - Order all locations by number.
 */
export default function sortByLocationFilename(a: string, b: string) {
  // If not a location, sort to bottom.
  const aIsLocation = Location.isLocationFilename(a);
  const bIsLocation = Location.isLocationFilename(b);
  if (aIsLocation && !bIsLocation) return -1;
  if (!aIsLocation && bIsLocation) return 1;
  if (!aIsLocation && !bIsLocation) return a.localeCompare(b);

  // Sort 1st 2 digits by value
  const aFirstTwo = Number(a.substring(0, 2));
  const bFirstTwo = Number(b.substring(0, 2));
  const firstTwoSort = aFirstTwo - bFirstTwo;
  if (firstTwoSort) return firstTwoSort;

  // If depth is different, sort by depth
  const aDepth = (new Location({ path: "", name: a })).depth;
  const bDepth = (new Location({ path: "", name: b })).depth;
  if (aDepth !== bDepth) {
    if (aDepth === AREA) return -1;
    if (bDepth === AREA) return 1;
    if (aDepth === CATEGORY) return -1;
    if (bDepth === CATEGORY) return 1;
    if (aDepth === ITEM) return -1;
    if (bDepth === ITEM) return 1;
  }

  const aLastTwo = Number(a.substring(3, 5));
  const bLastTwo = Number(b.substring(3, 5));
  if (aLastTwo && isNaN(bLastTwo)) return -1;
  if (isNaN(aLastTwo) && bLastTwo) return 1;

  return a.localeCompare(b);
}
