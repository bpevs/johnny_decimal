import { exists, join, parseYAML, stringifyYAML, walk } from "../deps.ts";
import { Command } from "./command.ts";
import { DirectoryCore } from "./directory_core.ts";
import { Location } from "./location.ts";

const walkOptions = Object.freeze({
  maxDepth: 3, // $JD_HOME/AREA/CATEGORY/ID -> 3
  includeFiles: false,
});

/**
 * @description
 * Directory is a Deno context-specific usage of DirectoryCore. This represents
 * the source of truth for our Johnny Decimal System.
 */
export class Directory extends DirectoryCore {
  config: any = {};
  commands: Record<string, Command> = {};

  /* User's Home directory (~) */
  $HOME: string;
  /* ~/.jd directory where we house settings, plugins,scripts. */
  $JD_DIR: string;
  /* The root of the user's Johnny Decimal System */
  $JD_HOME: string;

  constructor({ $HOME, $JD_DIR, $JD_HOME }: Record<string, string>) {
    super();
    this.$HOME = $HOME;
    this.$JD_DIR = $JD_DIR;
    this.$JD_HOME = $JD_HOME;
  }

  /**
   * @returns a list of locations matching a set of regex.
   */
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

  /**
   * @description
   * Finds all the locations matching a specific id. This can be an area,
   * category, or item id. This is meant to be used more like a "I know where
   * this is" kinds of usecases. Hopefully this is a single-item list.
   * @returns a list of locations
   */
  findLocationsById(id: string): Promise<Location[]> {
    return this.findLocations([Location.regex.matchId(id)]);
  }

  /**
   * @description
   * Finds all the locations matching a name. Based on a case-insensitive regex.
   * This is meant to be used for more "search" kinds of usecases.
   * @returns a list of locations
   */
  findLocationsByName(name: string): Promise<Location[]> {
    return this.findLocations([new RegExp(name, "i")]);
  }

  /**
   * @description gets the content of `~/.jd/config.yaml`. In the CLI, this is
   * currently only used for `arePluginsEnabled`;
   * @returns Basically anything. Define your own config structure.
   */
  async getConfig(name: string): Promise<any> {
    try {
      const configPath = join(this.$JD_DIR, "config.yaml");
      this.config = parseYAML(await Deno.readTextFile(configPath));
      return this.config[name];
    } catch (e) {}
  }

  /**
   *  @description lists all the locations in the Johnny Decimal root
   */
  listAllLocations(): Promise<Location[]> {
    return this.findLocations([new RegExp("")]);
  }

  /**
   * @description
   * IF plugins are enabled, this imports all commands from `~/.jd/plugins`,
   * and registers them as commands.
   */
  async loadPlugins() {
    const pluginsDir = join(this.$JD_DIR, "plugins");

    if (
      !await exists(pluginsDir) ||
      !await this.getConfig("pluginsEnabled")
    ) {
      return;
    }

    try {
      const plugins = walk(pluginsDir, {
        maxDepth: 3,
        includeDirs: false,
        match: [/main\.ts$/gi],
      });

      for await (const plugin of plugins) {
        this.registerCommand((await import(plugin.path)).default);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @description set the content of `~/.jd/config.yaml`
   * If we have just enabled plugins, load them.
   */
  async setConfig(name: string, value: any) {
    if (!name || value == null || (this.config[name] === value)) return;

    this.config[name] = value;

    const configPath = join(this.$JD_DIR, "config.yaml");
    await Deno.writeTextFile(
      configPath,
      stringifyYAML(this.config),
      { create: true },
    );

    if (name === "pluginsEnabled") {
      await this.loadPlugins();
    }
  }
}
