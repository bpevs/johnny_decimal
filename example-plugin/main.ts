import { Command, Directory } from "https://deno.land/x/johnny_decimal@0.1.3/mod.ts";

const sublCommand: Command = {
  name: "subl",
  usage: "jd subl <location>",
  description: "Open location in Sublime",

  async fn(this: Directory, [str]: string[] = []) {
    const [location] = await this.findLocationsById(str);

    await Deno.run({
      cmd: ["open", "-a", "Sublime Text", location.path],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).status();
  },
};

export default sublCommand;
