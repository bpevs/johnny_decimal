/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import {
  findFilesFromName,
  findPathFromLocation,
  getHome,
  getShallowFileList,
  help as displayHelp,
  Location,
  logFiles,
  open as openLocation,
} from "./mod.ts";

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;

// Use parsed args for reading commands
const { _, help } = parse(Deno.args);

if (help && _.length === 0) {
  displayHelp();
  Deno.exit(0);
}

type CommandMap = { [name: string]: (name: string[]) => void };
const commandMap: CommandMap = {
  list,
  ls: list,
  o: open,
  open,
  search,
  index,
};

if (commandMap[command]) commandMap[command](args);

if (Location.isLocationString(command)) {
  const location = Location.fromFilename(command);
  const path = await findPathFromLocation(location);
  if (!path) throw new Error("No Location Found");
  Deno.exit(0);
}

// COMMANDS
async function list([locationString]: string[]) {
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
    logFiles("Home", await getShallowFileList(getHome()));
  }
}

async function open([locationString]: string[]) {
  await openLocation(Location.fromFilename(locationString));
}

async function search([locationString]: string[]) {
  logFiles("Search Results", await findFilesFromName(args[0]));
}

async function index([locationString]: string[]) {
  logFiles("Search Results", await findFilesFromName(""));
}
