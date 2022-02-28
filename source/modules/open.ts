import { bold, red } from "https://deno.land/std@0.127.0/fmt/colors.ts";
import { exists } from "https://deno.land/std@0.127.0/fs/mod.ts";
import { Location } from "./Location.ts";
import { getDefaultApp, getHome } from "./environment.ts";
import { findPathFromLocation } from "./find.ts";
import { logLocationContents } from "./log.ts";

/**
 * Open Location
 */
export async function open(location: Location) {
  const dir = await findPathFromLocation(location);

  if (dir?.value?.path && await exists(dir?.value?.path)) {
    const p = Deno.run({
      cmd: ["open", "-a", getDefaultApp(), dir.value.path],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });
    await p.status();
  } else {
    const locationPath = location ? location.toString() : "Directory";
    console.error(red(bold(locationPath)), red("does not exist"));
    return;
  }
}
