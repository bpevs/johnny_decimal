import type { Command } from "../types.ts";

export class Directory {
  commands: Record<string, Command> = {};

  findLocationById() {}

  findLocationByName() {}

  hasCommand(name: string) {
    return this.commands[name] != null;
  }

  listAllLocations() {}

  registerCommand(command: Command) {
    this.commands[command.name] = command.bind(this);

    if (Array.isArray(command.alias)) {
      command.alias.forEach((alias) => {
        this.commands[alias] = command;
      });
    }
  }

  runCommand(name: string, args: string[]) {
    if (!name && this.commands.help) return this.commands.help(this)(...args);
    if (!this.commands[name]) {
      throw new Error("Directory: No Command Registered!");
    }
    return this.commands[name](this)(...args);
  }
}
