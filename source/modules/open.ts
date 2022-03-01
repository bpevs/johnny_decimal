import { exists } from "https://deno.land/std@0.127.0/fs/mod.ts";
import { Location } from "./Location.ts";
import { getDefaultApp } from "./environment.ts";
import { findPathFromLocation } from "./find.ts";

export async function open(location: Location) {
  const path = await findPathFromLocation(location);

  if (!path || !await exists(path)) {
    const locationPath = location ? location.toString() : "Directory";
    throw new Error(`${locationPath} does not exist`);
  }

  await Deno.run({
    cmd: ["open", "-a", getDefaultApp(), path],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).status();
}
