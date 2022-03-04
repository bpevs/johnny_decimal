import { basename } from "https://deno.land/std/path/mod.ts";

import { Command, isLocationFilename } from "../../core/mod.ts";
import { Directory } from "../models/Directory.ts";
import { logLocation } from "../utilities/logLocation.ts";

/**
 * If given a name to list, find that location, and list the contents.
 * If NOT given a name, and in JD FS, list the contents of the current dir.
 * @todo If NOT given a name, and NOT in JD FS, list JD FS's home.
 */
export const list: Command = Object.assign(
  (directory: Directory) =>
    async ([str]: string[]) => {
      const dirName = basename(Deno.cwd());

      let name;
      if (isLocationFilename(str)) name = str;
      else if (isLocationFilename(dirName)) name = dirName;

      if (name) {
        const id = name.split(" ")[0];
        const [location] = await directory.findLocationsById(id);
        logLocation(location.name, await location.getContents());
        Deno.exit(0);
      }
    },
  {
    name: "list",
  },
);
