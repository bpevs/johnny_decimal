/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { parse } from "./deps.ts";
import { $HOME, $JD_DIR, $JD_HOME } from "./constants.ts";
import { Directory } from "./models/directory.ts";

if ($HOME == null) throw new Error("No $HOME");
if ($JD_HOME == null) throw new Error("No $JD_HOME");
if ($JD_DIR == null) throw new Error("No $JD_DIR");

const directory = new Directory({
  $HOME: $HOME,
  $JD_HOME: $JD_HOME,
  $JD_DIR: $JD_DIR,
});

directory.registerCommand("default", () => import("./commands/default.ts"));
directory.registerCommand("help", () => import("./commands/help.ts"));
directory.registerCommand("index", () => import("./commands/index.ts"));
directory.registerCommand("install", () => import("./commands/install.ts"));
directory.registerCommand("list", () => import("./commands/list.ts"));
directory.registerCommand("open", () => import("./commands/open.ts"));
directory.registerCommand("search", () => import("./commands/search.ts"));
directory.registerCommand("setup", () => import("./commands/setup.ts"));
directory.registerCommand("uninstall", () => import("./commands/uninstall.ts"));

directory.registerAlias("list", ["ls"]);
directory.registerAlias("open", ["o"]);

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;
const { help } = parse(Deno.args);

if (help) {
  directory.runCommand("help", []);
} else if (directory.hasCommand(command)) {
  directory.runCommand(command, args);
}
