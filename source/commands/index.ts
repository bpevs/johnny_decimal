import { Directory } from "../models/directory.ts";
import { logLocationFilenames } from "../utilities/log_utilities.ts";

export default async function index(this: Directory) {
  const locations = await this.listAllLocations();
  const names = locations.map(({ name }) => name);
  logLocationFilenames(names);
}
