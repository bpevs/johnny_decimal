import { Command } from "./command.ts";

/**
 * @description
 * DirectoryCore is a structure to build accessors for a JD system. The key
 * feature of this is structure is the binding of commands to the directory.
 * This way, we can pass a common context to all our commands, allowing for
 * easy plugin extensibility.
 *
 * Separating this from the `Directory` class is a choice. Since it is not
 * unlikely we will want to use this class for dealing with JD in a web context,
 * it is preferred the infrastructure is pure JS, and is not using Deno methods
 * for things like data access. Separating this out into DirectoryCore lets
 * consumers create their own directory opinions.
 *
 * @example
 * class Directory extends DirectoryCore {
 *   constructor($JD_HOME){ this.$JD_HOME = $JD_HOME; }
 * }
 * const directory = new DirectoryCore()
 * directory.registerCommand("log-home", () => {
 *   console.log(this.$JD_HOME)
 * });
 * directory.runCommand("log-home");
 */
export class DirectoryCore {
  // Holds functions that import commands.
  commands: Record<string, any> = {};

  /** */
  hasCommand(name: string) {
    return this.commands[name] != null;
  }

  registerAlias(commandName: string, aliasNames: string[] = []) {
    aliasNames.forEach((aliasName) => {
      this.commands[aliasName] = this.commands[commandName];
    });
  }

  registerCommand(commandName: string, command: Command) {
    this.commands[commandName] = command;
    if (Array.isArray(command.alias)) {
      command.alias.forEach((alias) => {
        this.commands[alias] = command;
      });
    }
  }

  private retrieveCommand(commandName: string) {
    if (this.commands[commandName]) {
      return this.commands[commandName].fn.bind(this);
    }
  }

  async runCommand(commandName: string, args: string[]) {
    const command = this.retrieveCommand(commandName);
    if (command) return command(args);
    const defaultCommand = this.retrieveCommand("default");
    if (defaultCommand) return defaultCommand([commandName, ...args]);
  }
}
