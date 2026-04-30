import {
  Command,
  Directory,
} from "https://deno.land/x/johnny_decimal@1.0.2/mod.ts";

/**
 * @description Opens a location using the default file explorer
 */
const openCommand: Command = {
  name: "open",
  usage: "jd open <location>",
  description: "Open location in Finder",

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
