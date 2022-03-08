/**
 * CLI tool that can be used for interacting with a local filesystem
 */
import { exists, parse } from "./deps.ts";
import {
  $HOME,
  $JD_DIR,
  $JD_HOME,
  defaultCommand,
  Directory,
  helpCommand,
  indexCommand,
  installCommand,
  listCommand,
  openCommand,
  searchCommand,
  uninstallCommand,
} from "./mod.ts";

if ($HOME == null) throw new Error("No $HOME");
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
directory.registerCommand("uninstall", uninstallCommand);

if (!await exists($JD_DIR)) {
  await directory.runCommand("install", []);
  Deno.exit(0);
}

await directory.loadPlugins();

// Use raw args to keep categories and ids as strings
const [command, ...args] = Deno.args;
const { help } = parse(Deno.args);

if (help) {
  directory.runCommand("help", []);
} else if (directory.hasCommand(command)) {
  directory.runCommand(command, args);
}
