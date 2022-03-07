import { walk } from "../deps.ts";
import { DirectoryCore } from "./directory_core.ts";
import { Location } from "./location.ts";

const walkOptions = Object.freeze({
  maxDepth: 3, // $JD_HOME/AREA/CATEGORY/ID -> 3
  includeFiles: false,
});

export class Directory extends DirectoryCore {
  $HOME: string;
  $JD_DIR: string;
  $JD_HOME: string;

  constructor({ $HOME, $JD_DIR, $JD_HOME }: Record<string, string>) {
    super();
    this.$HOME = $HOME;
    this.$JD_DIR = $JD_DIR;
    this.$JD_HOME = $JD_HOME;
  }

  async findLocations(match: RegExp[] = []): Promise<Location[]> {
    const results: Array<Location> = [];
    const matches = walk(this.$JD_HOME, { ...walkOptions, match });

    for await (const { path, name } of matches) {
      if (name[0] === ".") continue;
      try {
        results.push(new Location({ name, path }));
      } catch (e) {}
    }

    return results;
  }

  findLocationsById(id: string): Promise<Location[]> {
    return this.findLocations([Location.regex.matchId(id)]);
  }

  findLocationsByName(name: string): Promise<Location[]> {
    return this.findLocations([new RegExp(name, "i")]);
  }

  listAllLocations() {
    return this.findLocations([new RegExp("")]);
  }
}