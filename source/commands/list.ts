import { basename } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import { Location } from "../models/location.ts";
import { logLocationFilenames, logTitle } from "../utilities/log_utilities.ts";

/**
 * If given a name to list, find that location, and list the contents.
 * If NOT given a name, and in JD FS, list the contents of the current dir.
 * @todo If NOT given a name, and NOT in JD FS, list JD FS's home.
 */
const listCommand: Command = {
  name: "list",
  description: "List files in a location",
  usage: "jd ls [<location>]",
  alias: ["ls"],

  async fn(this: Directory, [str]: string[]) {
    const currDirName = basename(Deno.cwd());
    const id = Location.parseId(str) || Location.parseId(currDirName);

    if (id) {
      const [location] = await this.findLocationsById(id);
      logTitle(location.name);
      const contents = await location.getContents();
      logLocationFilenames(contents.map((dir) => dir.name));
    } else {
      logTitle("HOME");

      const contents: Array<Deno.DirEntry> = [];
      for await (const file of Deno.readDir(this.$JD_HOME)) {
        if (file.name[0] !== ".") contents.push(file);
      }

      logLocationFilenames(contents.map((dir) => dir.name));
    }
    Deno.exit(0);
  },
};

export default listCommand;
