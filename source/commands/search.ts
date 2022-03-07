import { Directory } from "../models/directory.ts";
import { logLocationFilenames, logTitle } from "../utilities/log_utilities.ts";
import { Command } from "../models/command.ts";

export default class SearchCommand extends Command {
  name = "default";
  usage = "jd search [<string>]";
  description = "Search for files that match a string";

  async fn(this: Directory, [str]: string[]) {
    const locations = await this.findLocationsByName(str);

    logTitle("Search Results");
    logLocationFilenames(locations.map((location) => location.name));
  }
}
