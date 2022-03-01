import type { Location } from "./Location.ts";

import { getHome } from "./environment.ts";
import { findPathFromLocation } from "./find.ts";
import { getShallowFileList } from "./getShallowFileList.ts";

export async function list(location?: Location): Promise<Array<Deno.DirEntry>> {
  const path = location ? (await findPathFromLocation(location)) : getHome();

  if (!path) {
    const locationPath = location ? location.toString() : "Directory";
    throw new Error(`${locationPath} does not exist`);
  }

  return getShallowFileList(path);
}
