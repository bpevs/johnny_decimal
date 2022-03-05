import { basename, copySync, ensureDir, exists, join, walk } from "../deps.ts";
import { logLocation } from "../utilities/log_location.ts";
import { DirectoryCore } from "./directory_core.ts";
import { Location } from "./location.ts";
import { sortByLocation } from "../utilities/sort_by_location.ts";

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

  async findLocations(match: RegExp[] = []): Promise<Location[]> {
    const results: Array<Location> = [];
    const matches = walk(this.homeDir, { ...options, match });

    for await (const { path, name } of matches) {
      if (name[0] === ".") continue;
      results.push(new Location({ name, path }));
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
    return this.findLocations([]);
  }

  commands = {
    help: () => {
      console.log(
        "Johnny Decimal CLI\n\n" +
          "Note: <location> refers to a Johnny Decimal location. " +
          "This includes:\n" +
          "  - Area Locations: \`10-19\`\n" +
          "  - Category Locations: \`11\`\n" +
          "  - ID Locations: \`11.02\`\n\n" +
          "Usage:\n",
      );
      console.table({
        "jd --help": "Show this message",
        "jd [<location>]":
          "Change directory to location. If location ommitted, go to root.",
        "jd ls [<location>]": "List files in a location",
        "jd open <location>": "Open location, using $JD_DEFAULT_APP",
        "jd index": "Show all directories in your JD filesystem",
      });
    },

    install: async () => {
      console.log("Installing cd script into `~/.jd/main.sh`...");
      await ensureDir(this.configDir);
      copySync(this.shDir, join(this.configDir), { overwrite: true });

      // Add source entry into existing .zshrc file
      // @todo, work with whatever shell
      const rcFilepath = join(this.$HOME, ".zshrc");
      const sourceText = "source $HOME/.jd/main.sh";
      const contents = await Deno.readTextFile(rcFilepath);

      if (!contents.includes(sourceText)) {
        const data = (new TextEncoder()).encode("\n" + sourceText + "\n");
        await Deno.writeFile(rcFilepath, data, { append: true });
      }

      console.log("`~/.jd/main.sh` is successfully added");
      console.log("Please reload or re-source your terminal window");
    },

    /**
     * If given a name to list, find that location, and list the contents.
     * If NOT given a name, and in JD FS, list the contents of the current dir.
     * @todo If NOT given a name, and NOT in JD FS, list JD FS's home.
     */
    list: async ([str]: string[]) => {
      const dirName = basename(Deno.cwd());

      let name;
      if (Location.isLocationFilename(str)) name = str;
      else if (Location.isLocationFilename(dirName)) name = dirName;

      const id = Location.parseId(name);

      if (id) {
        const [location] = await this.findLocationsById(id);
        logLocation(location.name, await location.getContents());
      } else {
        const contents: Array<Deno.DirEntry> = [];
        for await (const file of Deno.readDir(this.homeDir)) {
          if (file.name[0] !== ".") contents.push(file);
        }
        logLocation("Home", contents);
      }
      Deno.exit(0);
    },

    open: async ([str]: string[]) => {
      const [location] = await this.findLocationsById(str);

      if (!await exists(location.path)) {
        throw new Error(`Could not find: ${str}`);
      }

      await Deno.run({
        cmd: ["open", "-a", this.defaultApp, location.path],
        stdin: "piped",
        stdout: "piped",
        stderr: "piped",
      }).status();
    },

    search: async ([str]: string[]) => {
      const [location] = await this.findLocationsById(str);
      const { path } = location;

      if (!path || !await exists(path)) {
        const locationPath = location ? location.toString() : "Directory";
        throw new Error(`${locationPath} does not exist`);
      }

      await Deno.run({
        cmd: ["open", "-a", this.defaultApp, path],
        stdin: "piped",
        stdout: "piped",
        stderr: "piped",
      }).status();

      logLocation("Search Results", await location.getContents());
    },

    setup: async () => {
      console.warn("This functionality requires installation of jd script");
      if (confirm("Install now?")) {
        await this.commands.install();
      } else {
        console.log(
          "\nYou can install at any time with `jd install`.\n" +
            "The only functionality that depends on this is `cd`\n" +
            "You can also manually install this script yourself by\n" +
            "copying `source/shell/main.sh` file from the source code, and adding\n" +
            "source ${PATH_TO_MAIN_JS}` to your bash profile.\n",
        );
      }
    },

    // @todo doesn't yet remove source text from bash_profile
    uninstall: async () => {
      console.log("Deleting `~/.jd`...");
      await Deno.remove(this.configDir, { recursive: true });
      console.log("~/.jd is successfully removed");
      console.log("Please reload or re-source your terminal window");
    },
  };
}
