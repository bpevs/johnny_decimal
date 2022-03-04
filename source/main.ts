/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { exists, parse } from "./deps.ts";

import {
  HOME_DIR,
  JD_CONFIG_DIR,
  JD_DEFAULT_APP,
  JD_FILESYSTEM_DIR,
  SH_DIR,
} from "./constants.ts";
import { Directory } from "./models/directory.ts";

const directory = new Directory({
  $HOME: HOME_DIR,
  homeDir: JD_FILESYSTEM_DIR,
  configDir: JD_CONFIG_DIR,
  shDir: SH_DIR,
  defaultApp: JD_DEFAULT_APP,
});

directory.registerAlias("ls", "list");
directory.registerAlias("o", "open");

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;

if (directory.hasCommand(command)) {
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
