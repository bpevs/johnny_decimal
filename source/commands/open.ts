import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";

const openCommand: Command = {
  name: "open",
  usage: "jd open <location>",
  description: "Open location in Finder",

  async fn(this: Directory, [str]: string[]) {
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
