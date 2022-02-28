import { bold, red } from "https://deno.land/std@0.127.0/fmt/colors.ts";
import { Location } from "./Location.ts";
import { getDefaultApp, getHome } from "./environment.ts";
import { findPathFromLocation } from "./find.ts";
import { logLocationContents } from "./log.ts";

/**
 * Returns a list of dirs in a location
 * @todo split logging out into separate function
 */
export async function list(location?: Location) {
  const homeDir = { path: getHome(), name: "Home" };
  const locationDir = location
    ? (await findPathFromLocation(location))?.value || {}
    : homeDir;

  if (!locationDir.path) {
    const locationPath = location ? location.toString() : "Directory";
    console.error(red(bold(locationPath)), red("does not exist"));
    return;
  }

  const entities = [];
  for await (const entity of Deno.readDir(locationDir.path)) {
    entities.push(entity);
  }

  console.log(`\n${bold(locationDir.name)}\n===`);
  logLocationContents(entities, location);
  console.log("");
}
