import { Location } from "./Location.ts";
import { sortByLocation } from "./sortByLocation.ts";

export interface Options {
  includeHidden?: boolean;
}

export async function getShallowFileList(
  path: string,
  { includeHidden = false }: Options = {},
): Promise<Array<Deno.DirEntry>> {
  const contents: Array<Deno.DirEntry> = [];

  for await (const file of Deno.readDir(path)) {
    if (file.name[0] === "." && !includeHidden) continue;
    contents.push(file);
  }

  return contents.sort(sortByLocation);
}
