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
 * directory.registerCommand({
 *   name: "log-home",
 *   fn: () => {
 *     console.log(this.$JD_HOME)
 *   }
 * });
 * directory.runCommand("log-home");
 */
export class DirectoryCore {
  // Holds functions that import commands.
  commands: Record<string, any> = {};

  /**
   * @description checks if a command is registered
   * @example directory.hasCommand("my-command");
   */
  hasCommand(name: string): boolean {
    return this.commands[name] != null;
  }

  /**
   * @description registers an alias for an existing command.
   * @example
   * directory.registerAlias("my-command", [ "mc" ]);
   * directory.runAlias("mc"); // Runs the command "my-command"
   */
  registerAlias(commandName: string, aliasNames: string[] = []): void {
    aliasNames.forEach((aliasName) => {
      this.commands[aliasName] = this.commands[commandName];
    });
  }

  /**
   * @description registers a command to be run later.
   * @example directory.registerAlias({
   *   name: "my-command",
   *   fn() { return "hello" }
   * });
   */
  registerCommand(command: Command): void {
    this.commands[command.name] = command;
    if (Array.isArray(command.alias)) {
      command.alias.forEach((alias) => {
        this.commands[alias] = command;
      });
    }
  }

  /**
   * @description retreives a command function, and prepares it to be invoked.
   */
  private retrieveCommand(commandName: string) {
    if (this.commands[commandName]) {
      return this.commands[commandName].fn.bind(this);
    }
  }

  /**
   * @description run a command. If none is found, try to run the default
   * command (a command registered with the id "default").
   * @example directory.runCommand("my-command");
   */
  async runCommand(commandName: string, args: string[]) {
    const command = this.retrieveCommand(commandName);
    if (command) return command(args);
    const defaultCommand = this.retrieveCommand("default");
    if (defaultCommand) return defaultCommand([commandName, ...args]);
  }
}
