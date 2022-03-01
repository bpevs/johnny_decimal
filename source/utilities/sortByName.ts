export function sortByName(a: Deno.DirEntry, b: Deno.DirEntry) {
  return a.name.localeCompare(b.name);
}
