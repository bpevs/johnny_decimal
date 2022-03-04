import { LocationCore } from "./LocationCore.ts";

export class Location extends LocationCore {
  async getContents(): Promise<Deno.DirEntry[]> {
    const contents: Array<Deno.DirEntry> = [];

    for await (const file of Deno.readDir(this.path)) {
      if (file.name[0] === ".") continue;
      contents.push(file);
    }

    return contents;
  }
}
