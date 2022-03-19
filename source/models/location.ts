import { LocationCore } from "./location_core.ts";

export class Location extends LocationCore {
  /**
   * @description
   * Lists files/directories contained in a Location. This relies on Deno fs
   * access.
   * @return list of file information, not including hidden files
   */
  async getContents(): Promise<Deno.DirEntry[]> {
    const contents: Array<Deno.DirEntry> = [];

    for await (const file of Deno.readDir(this.path)) {
      if (file.name[0] === ".") continue;
      contents.push(file);
    }

    return contents;
  }
}
