import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";

/**
 * @description Opens a location using the default file explorer
 * @todo make this work in windows.
 */
const openCommand: Command = {
  name: "open",

  async fn(this: Directory, [str]: string[] = []) {
    const [location] = await this.findLocationsById(str);

    await Deno.run({
      cmd: ["open", "-a", "Finder", location.path],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).status();
  },
};

export default openCommand;
