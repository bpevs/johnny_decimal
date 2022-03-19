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
  pluginCommand,
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

directory.registerCommand(defaultCommand);
directory.registerCommand(helpCommand);
directory.registerCommand(indexCommand);
directory.registerCommand(installCommand);
directory.registerCommand(listCommand);
directory.registerCommand(openCommand);
directory.registerCommand(pluginCommand);
directory.registerCommand(searchCommand);
directory.registerCommand(uninstallCommand);

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
} else {
  directory.runCommand(command, args);
}
