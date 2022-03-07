import { Directory } from "../models/directory.ts";
import { logLocationFilenames, logTitle } from "../utilities/log_utilities.ts";

export default async function search(this: Directory, [str]: string[]) {
  const locations = await this.findLocationsByName(str);

  logTitle("Search Results");
  logLocationFilenames(locations.map((location) => location.name));
}
