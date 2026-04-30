import {
  Command,
  Directory,
} from "https://deno.land/x/johnny_decimal@1.0.2/mod.ts";

import openInSublime from "../shared/open_in_sublime.ts";

const sublimeCommand: Command = {
  name: "sublime",
  alias: ["subl"],
  usage: "jd sublime <location>",
  description: "Open location in Sublime",

  async fn(this: Directory, [str]: string[] = []) {
    const [location] = await this.findLocationsById(str);
    console.log(location.path);
    await openInSublime(location.path);
  },
};

export default sublimeCommand;
