/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "./deps.ts";
import { $HOME, $JD_DIR, $JD_HOME } from "./constants.ts";
import { Directory } from "./models/directory.ts";

import defaultCommand from "./commands/default.ts";
import helpCommand from "./commands/help.ts";
import indexCommand from "./commands/index.ts";
import installCommand from "./commands/install.ts";
import listCommand from "./commands/list.ts";
import openCommand from "./commands/open.ts";
import searchCommand from "./commands/search.ts";
import setupCommand from "./commands/setup.ts";
import uninstallCommand from "./commands/uninstall.ts";

if ($HOME == null) throw new Error("No $HOME");
if ($JD_HOME == null) throw new Error("No $JD_HOME");
if ($JD_DIR == null) throw new Error("No $JD_DIR");

const directory = new Directory({
  $HOME: $HOME,
  $JD_HOME: $JD_HOME,
  $JD_DIR: $JD_DIR,
});

directory.registerCommand("default", defaultCommand);
directory.registerCommand("help", helpCommand);
directory.registerCommand("index", indexCommand);
directory.registerCommand("install", installCommand);
directory.registerCommand("list", listCommand);
directory.registerCommand("open", openCommand);
directory.registerCommand("search", searchCommand);
directory.registerCommand("setup", setupCommand);
directory.registerCommand("uninstall", uninstallCommand);

await directory.loadPlugins();

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;
const { help } = parse(Deno.args);

if (help) {
  directory.runCommand("help", []);
} else if (directory.hasCommand(command)) {
  directory.runCommand(command, args);
}
