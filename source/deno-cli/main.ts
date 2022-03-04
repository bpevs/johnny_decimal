/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "https://deno.land/std/flags/mod.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";

import {
  HOME_DIR,
  JD_CONFIG_DIR,
  JD_DEFAULT_APP,
  JD_FILESYSTEM_DIR,
  SH_DIR,
} from "./constants.ts";
import { Directory } from "./models/Directory.ts";
import { install } from "./commands/install.ts";
import { list } from "./commands/list.ts";
// import { open } from "./commands/open.ts";
// import { search } from "./commands/search.ts";
// import { setup } from "./commands/setup.ts";
// import { uninstall } from "./commands/uninstall.ts";

const directory = new Directory({
  $HOME: HOME_DIR,
  homeDir: JD_FILESYSTEM_DIR,
  configDir: JD_CONFIG_DIR,
  shDir: SH_DIR,
  defaultApp: JD_DEFAULT_APP,
});

directory.registerCommand(install);
directory.registerCommand(list);

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;

// Use parsed args for reading commands
const { _, help } = parse(Deno.args);

if (help && _.length === 0) {
  // displayHelp();
  Deno.exit(0);
}

type CommandMap = { [name: string]: (name: string[]) => void };

// const commandMap: CommandMap = {
//   list,
//   ls: list,
//   o: open,
//   open,
//   search,
//   index: (...args) => search([""]),
//   install,
//   uninstall,
// };

if (directory.hasCommand(command, args)) {
  directory.runCommand(command, args);
}
// else {
//   if (!await exists(jdDir)) {
//     setup();
//   }
//   if (Location.isLocationString(command)) {
//     const location = Location.fromFilename(command);
//     const path = await findPathFromLocation(location);
//     if (!path) throw new Error("No Location Found");
//     Deno.exit(0);
//   }
// }
