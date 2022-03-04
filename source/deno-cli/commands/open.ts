import { exists } from "https://deno.land/std/fs/mod.ts";

import { Location } from "../../core/Location.ts";
import { JD_DEFAULT_APP } from "../constants.ts";
import { directory } from "../utilities/directory";

function open([str]: string[]) {
  const location = await directory.findLocationFromId(str);

  if (!await exists(location.path)) {
    throw new Error(`Could not find: ${str}`);
  }

  await Deno.run({
    cmd: ["open", "-a", JD_DEFAULT_APP, location.path],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).status();
}
