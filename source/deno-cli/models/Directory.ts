import { walk } from "https://deno.land/std/fs/mod.ts";
import {
  Directory as DirectoryCore,
  getSearchRegex,
  sortByLocation,
} from "../../core/mod.ts";
import { Location } from "./Location.ts";

const options = Object.freeze({
  maxDepth: 3, // $JD_HOME/AREA/CATEGORY/ID -> 3
  includeFiles: false,
});

export class Directory extends DirectoryCore {
  $HOME: string;
  homeDir: string;
  configDir: string;
  shDir: string;
  defaultApp: string;

  constructor(props: Record<string, string>) {
    super();
    const { $HOME, homeDir, configDir, shDir, defaultApp } = props;
    this.$HOME = $HOME;
    this.homeDir = homeDir;
    this.configDir = configDir;
    this.shDir = shDir;
    this.defaultApp = defaultApp;
  }

  async findLocations(match?: RegExp[] = []): Promise<Location[]> {
    const results: Array<Location> = [];
    const matches = walk(this.homeDir, { ...options, match });

    for await (const { path, name } of matches) {
      if (name[0] === ".") continue;
      results.push(new Location({ id, name, path }));
    }

    return results;
  }

  findLocationsById(id: string): Promise<Location[]> {
    return this.findLocations([getSearchRegex(id)]);
  }

  findLocationsByName(name: string): Promise<Location[]> {
    return this.findLocations([new RegExp(name, "i")]);
  }

  listAllLocations() {
    return this.findLocations([]);
  }
}
