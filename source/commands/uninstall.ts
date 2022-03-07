import { Directory } from "../models/directory.ts";
import { join } from "../deps.ts";
import { Command } from "../models/command.ts";

export default class UninstallCommand extends Command {
  name = "uninstall";

  // @todo doesn't yet remove source text from bash_profile
  async fn(this: Directory) {
    const { $HOME, $JD_DIR } = this;
    if (confirm(`Step 1: Remove ${$JD_DIR}? This removes all settings.`)) {
      console.log(`Deleting ${$JD_DIR}...`);
      try {
        await Deno.remove($JD_DIR, { recursive: true });
        console.log(`${$JD_DIR} is successfully removed`);
      } catch (e) {
        console.log("Failed! Did you already remove `.jd`?\n");
      }
    }

    const rcFilepath = join($HOME, ".zshrc");
    const sourceText = "source $HOME/.jd/main.sh";
    if (confirm(`Step 2: Remove "${sourceText}" from ${rcFilepath}?`)) {
      const contents = await Deno.readTextFile(rcFilepath);

      if (!contents.includes(sourceText)) {
        console.log("Cannot find sounce line!  Did you already remove it?");
        return;
      }

      if (confirm(`This will edit the file ${rcFilepath}. Are you sure?`)) {
        const textToRemove = "\n" + sourceText;
        const filteredContents = contents.replace(textToRemove, "");
        await Deno.writeTextFile(rcFilepath, filteredContents);
        console.log(
          `${sourceText}" successfully removed from \`${rcFilepath}\``,
        );
        console.log("Please reload or re-source your terminal window");
      }
    }
  }
}
