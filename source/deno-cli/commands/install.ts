import type { Command } from "../../core/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { copySync, ensureDir } from "https://deno.land/std/fs/mod.ts";
import { Directory } from "../models/Directory.ts";

export const install: Command = Object.assign(
  (directory: Directory) =>
    async (directory: Directory) => {
      console.log("Installing cd script into `~/.jd/main.sh`...");
      await ensureDir(directory.configDir);
      copySync(directory.shDir, join(directory.configDir), { overwrite: true });

      // Add source entry into existing .zshrc file
      // @todo, work with whatever shell
      const rcFilepath = join(directory.$HOME, ".zshrc");
      const sourceText = "source $HOME/.jd/main.sh";
      const contents = await Deno.readTextFile(rcFilepath);

      if (!contents.includes(sourceText)) {
        const data = (new TextEncoder()).encode("\n" + sourceText + "\n");
        await Deno.writeFile(rcFilepath, data, { append: true });
      }

      console.log("`~/.jd/main.sh` is successfully added");
      console.log("Please reload or re-source your terminal window");
    },
  {
    name: "install",
  },
);
