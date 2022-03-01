/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";
import { help as displayHelp, list, Location, open } from "./mod.ts";

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;

// Use parsed args for reading commands
const { _, help } = parse(Deno.args);

if (help && _.length === 0) {
  displayHelp();
  Deno.exit(0);
}

if (command === "ls" || command === "list") {
  const [locationString] = args;
  if (Location.isLocationString(locationString)) {
    await list(Location.fromFilename(locationString));
  } else {
    await list();
  }
  Deno.exit(0);
}

if (command === "open") {
  const [locationString] = args;
  await open(Location.fromFilename(locationString));
  Deno.exit(0);
}

if (Location.isLocationString(command)) {
  await list(Location.fromFilename(command));
} else {
  await list();
}
