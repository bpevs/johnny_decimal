/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";
import { basename } from "https://deno.land/std@0.127.0/path/mod.ts";
import {
  findFilesFromName,
  findPathFromLocation,
  getShallowFileList,
  help as displayHelp,
  list,
  Location,
  logFiles,
  open,
} from "./mod.ts";

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
    const location = Location.fromFilename(locationString);
    const path = await findPathFromLocation(location);
    logFiles(basename(path), await getShallowFileList(path));
    Deno.exit(0);
  }

  const dirName = basename(Deno.cwd());

  if (Location.isLocationString(dirName)) {
    const location = Location.fromFilename(dirName);
    const path = await findPathFromLocation(location);
    logFiles(basename(path), await getShallowFileList(path));
  } else {
    logFiles("Home", await list());
  }
  Deno.exit(0);
}

if (command === "o" || command === "open") {
  const [locationString] = args;
  await open(Location.fromFilename(locationString));
  Deno.exit(0);
}

if (command === "search") {
  logFiles("Search Results", await findFilesFromName(args[0]));
  Deno.exit(0);
}

if (command === "index") {
  logFiles("Search Results", await findFilesFromName(""));
  Deno.exit(0);
}

if (Location.isLocationString(command)) {
  const location = Location.fromFilename(command);
  const path = await findPathFromLocation(location);
  if (!path) throw new Error("No Location Found");
  Deno.exit(0);
}
