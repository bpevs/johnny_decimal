/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";

import { help as displayHelp, list, Location, open } from "./mod.ts";

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;

// Use parsed args for reading commands
const { _, help, ls } = parse(Deno.args);

if (help && _.length === 0) {
  displayHelp();
} else if (command === "ls" || command === "list") {
  const [locationString] = args;
  await locationString ? list(new Location(locationString)) : list();
} else if (Location.isLocationString(command)) {
  const location = Location.fromFilename(command);
  if (location.id) {
    await open(location);
  } else if (location.area || location.category) {
    list(location);
  }
} else {
  list();
}
