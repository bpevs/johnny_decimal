import { red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import { Location } from "../models/location.ts";

const defaultCommand: Command = {
  name: "default",

  async fn(this: Directory, [command, ...args] = []) {
    const locationName = command === "default" ? args[0] : command;
    if (Location.isLocationFilename(locationName)) {
      const locations = await this.findLocationsById(locationName);
      if (!locations.length) {
        console.error(red(`No Location Found for: "${locationName}"`));
      }
    }
  },
};

export default defaultCommand;
