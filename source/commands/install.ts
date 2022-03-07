import { copySync, dirname, ensureDir, fromFileUrl, join } from "../deps.ts";
import { Directory } from "../models/directory.ts";
import { Command } from "../models/command.ts";

const jdDirContents = join(dirname(fromFileUrl(import.meta.url)), "../shell");

export default const installCommand: Commanmd = {
  name: "install",
  usage: "jd install",
  description: "Install the `cd` script, and create plugin dir",

  async fn(this: Directory) {
    const { $HOME, $JD_DIR } = this;

    if (confirm(`Step 1: Create Johnny Decimal Directory at \`${$JD_DIR}\`?`)) {
      try {
        copySync(jdDirContents, join($JD_DIR));
        console.log("Created!\n");
      } catch (e) {
        console.log("Failed! Maybe `.jd` already exists?");
      }
    } else {
      console.log("Skipping...\n");
    }

    // Add source entry into existing .zshrc file
    // @todo, work with whatever shell
    const rcFilepath = join($HOME, ".zshrc");
    const sourceText = "source $HOME/.jd/main.sh";
    if (confirm(`Step 2: Add "${sourceText}" to ${rcFilepath}?`)) {
      const contents = await Deno.readTextFile(rcFilepath);

      if (contents.includes(sourceText)) {
        console.log("The source line already exists!\nSkipping...\n");
        return;
      }

      if (confirm(`This will edit ${rcFilepath}. Are you sure?`)) {
        console.log("Adding source line...");

        const data = (new TextEncoder()).encode("\n" + sourceText + "\n");
        await Deno.writeFile(rcFilepath, data, { append: true });
        console.log("`~/.jd/main.sh` is successfully added");
        console.log("Please reload or re-source your terminal window");
      }
    }
  }
}
