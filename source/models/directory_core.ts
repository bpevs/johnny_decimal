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
  commands: Record<string, any> = {};

  hasCommand(name: string) {
    return this.commands[name] != null;
  }

  registerAlias(aliasName: string, commandName: string) {
    this.commands[aliasName] = this.commands[commandName];
  }

  registerCommand(name: string, command: any) {
    this.commands[name] = command.bind(this);

    if (Array.isArray(command.alias)) {
      command.alias.forEach((alias: string) => {
        this.commands[alias] = command;
      });
    }
  }

  runCommand(commandName: string, args: string[]) {
    if (!commandName && this.commands.help) {
      return this.commands.help(args);
    }
    if (!this.commands[commandName]) {
      throw new Error("Directory: No Command Registered!");
    }
    return this.commands[commandName](args);
  }
}
