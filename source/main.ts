/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";
import {
  basename,
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std/path/mod.ts";
import { copySync, ensureDir, exists } from "https://deno.land/std/fs/mod.ts";
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

// ~/.jd is used for installation script
const homeDir = Deno.env.get("HOME") || "~";
const jdDir = join(homeDir, ".jd");
const shDir = join(dirname(fromFileUrl(import.meta.url)), "shell");

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
  install,
  uninstall,
};

if (commandMap[command]) {
  commandMap[command](args);
} else {
  if (!await exists(jdDir)) {
    console.warn("This functionality requires installation of jd script");
    if (confirm("Install now?")) {
      await install();
    } else {
      console.log(
        "\nYou can install at any time with `jd install`.\n" +
          "The only functionality that depends on this is `cd`\n" +
          "You can also manually install this script yourself by\n" +
          "copying `source/shell/main.sh` file from the source code, and adding\n" +
          "source ${PATH_TO_MAIN_JS}` to your bash profile.\n",
      );
    }
  }
  if (Location.isLocationString(command)) {
    const location = Location.fromFilename(command);
    const path = await findPathFromLocation(location);
    if (!path) throw new Error("No Location Found");
    Deno.exit(0);
  }
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

async function install() {
  console.log("Installing cd script into `~/.jd/main.sh`...");
  await ensureDir(jdDir);
  copySync(shDir, join(jdDir), { overwrite: true });

  // Add source entry into existing .zshrc file
  const rcFilepath = join(homeDir, ".zshrc");
  const sourceText = "source $HOME/.jd/main.sh";
  const contents = await Deno.readTextFile(rcFilepath);

  if (!contents.includes(sourceText)) {
    const data = (new TextEncoder()).encode("\n" + sourceText + "\n");
    await Deno.writeFile(rcFilepath, data, { append: true });
  }

  console.log("`~/.jd/main.sh` is successfully added");
  console.log("Please reload or re-source your terminal window");
}

async function uninstall() {
  console.log("Deleting `~/.jd`...");
  await Deno.remove(jdDir, { recursive: true });
  console.log("~/.jd is successfully removed");
  console.log("Please reload or re-source your terminal window");
}
