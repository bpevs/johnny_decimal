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

  // The actual command executors. Only be referenced by "retreiveCommand".
  private commandFuncs: Record<string, any> = {};

  hasCommand(name: string) {
    return this.commands[name] != null;
  }

  registerAlias(commandName: string, aliasNames: string[]) {
    aliasNames.forEach((aliasName) => {
      this.commands[aliasName] = this.commands[commandName];
    });
  }

  registerCommand(commandName: string, commandImportFunc: any) {
    this.commands[commandName] = commandImportFunc;
  }

  private async retrieveCommand(commandName: string) {
    const importCommand = this.commands[commandName];

    if (!this.commandFuncs[commandName] && importCommand) {
      const importtedCommand = (await importCommand()).default;
      this.commandFuncs[commandName] = importtedCommand.fn.bind(this);
    }

    return this.commandFuncs[commandName];
  }

  async runCommand(commandName: string, args: string[]) {
    const command = await this.retrieveCommand(commandName);
    if (command) return command(args);

    const defaultCommand = await this.retrieveCommand("default");
    if (defaultCommand) return defaultCommand(args);
  }
}
