import { Directory } from "../models/directory.ts";
import { Command } from "../models/command.ts";
import { logLocationFilenames } from "../utilities/log_utilities.ts";

export default const indexCommand: Command = {
  name: "index",
  usage: "jd index",
  description: "Show all directories in your JD filesystem",

  async fn(this: Directory) {
    const locations = await this.listAllLocations();
    const names = locations.map(({ name }) => name);
    logLocationFilenames(names);
  }
}
