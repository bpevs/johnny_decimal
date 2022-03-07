import { Command } from "./command.ts";

/**
 * The idea is that these core classes can be used in Deno AND as a buildable
 * web dependency. Mostly for if anyone wants to use the models and
 * infrastructure to organize a web client for, say, a cms or email server or
 * something.
 *
 * In practice, this is primarily based around `Location`, which is a class
 * that we expect to override for various platforms.
 */

export class DirectoryCore {
  // Holds functions that import commands.
  commands: Record<string, any> = {};

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
    return this.commands[commandName].fn.bind(this);
  }

  async runCommand(commandName: string, args: string[]) {
    const command = this.retrieveCommand(commandName);
    if (command) return command(args);

    const defaultCommand = this.retrieveCommand("default");
    if (defaultCommand) return defaultCommand(args);
  }
}
