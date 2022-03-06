import { Directory } from "../models/directory.ts";
import { copySync, dirname, ensureDir, fromFileUrl, join } from "../deps.ts";

const jdDirContents = join(dirname(fromFileUrl(import.meta.url)), "../shell");

export default async function install(this: Directory) {
  const { $HOME, $JD_DIR } = this;

  console.log("Creating Johnny Decimal Directory at `$HOME/.jd/`...");
  await ensureDir($JD_DIR);
  copySync(jdDirContents, join($JD_DIR));

  // Add source entry into existing .zshrc file
  // @todo, work with whatever shell
  console.log("Sourcing cd script `$HOME/.jd/main.sh` in `$HOME/.zshrc`");
  const rcFilepath = join($HOME, ".zshrc");
  const sourceText = "source $HOME/.jd/main.sh";
  const contents = await Deno.readTextFile(rcFilepath);

  if (!contents.includes(sourceText)) {
    const data = (new TextEncoder()).encode("\n" + sourceText + "\n");
    await Deno.writeFile(rcFilepath, data, { append: true });
  }

  console.log("`~/.jd/main.sh` is successfully added");
  console.log("Please reload or re-source your terminal window");
}
