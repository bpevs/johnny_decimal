import { red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import { Location } from "../models/location.ts";

const defaultCommand: Command = {
  name: "default",

  async fn(this: Directory, [command, ...args] = []) {
    if (Location.isLocationFilename(command)) {
      const locations = await this.findLocationsById(command);
      if (!locations.length) {
        console.error(red(`No Location Found for: "${command}"`));
      }
      Deno.exit(0);
    }
  },
};

export default defaultCommand;
