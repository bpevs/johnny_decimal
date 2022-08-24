import { bold, green, red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import {
  getShellConfigPath,
  getShellName,
  SHELL,
} from "../utilities/get_default_shell_config.ts";
const { FISH, ZSH, BASH } = SHELL;

const JD_HOME_TEXT = {
  [BASH]: 'export JD_HOME="{JD_HOME}"',
  [ZSH]: 'export JD_HOME="{JD_HOME}"',
  [FISH]: 'set -x JD_HOME "{JD_HOME}"',
};

const SOURCE_TEXT = {
  [BASH]: "source $HOME/.jd/main.sh",
  [ZSH]: "source $HOME/.jd/main.sh",
  [FISH]: "source $HOME/.jd/main.fish",
};

const shellName = getShellName();
const jdHomeTemplate = JD_HOME_TEXT[shellName];
const sourceText = SOURCE_TEXT[shellName];

if (!jdHomeTemplate || !sourceText) {
  throw new Error(`Unsupported Shell: ${shellName}`);
}

const log = {
  step1: {
    intro: ($JD_DIR: string) => {
      console.log(bold(green("Step 1 of 2")));
      console.log(`\`${$JD_DIR}\` contains settings, scripts, and plugins.\n`);
    },
    query: ($JD_DIR: string) =>
      confirm(`Would you like to delete \`${$JD_DIR}\` automatically?`),
    progress: ($JD_DIR: string) => console.log(`Deleting ${$JD_DIR}...`),
    complete: ($JD_DIR: string) =>
      console.log(green(`${$JD_DIR} is successfully removed!`)),
    failed: (error: Error) => {
      console.log(red("Failed! Did you already remove `.jd`?\n"));
      console.error(error);
    },
  },

  step2: {
    intro: (jdHomeText: string, shellConfigPath: string) =>
      console.log(
        `\n${bold(green("Step 2 of 2"))}\n` +
          `To delete JD CLI, please remove lines from ${shellConfigPath}:\n` +
          `\n      ${red("-")} ${jdHomeText}` +
          `\n      ${red("-")} ${sourceText}`,
      ),
    query: () => confirm(bold("Make these changes automatically?")),
    failed: (failText: string) =>
      console.log(
        red(`Cannot find \`${failText}\`!  Did you already remove it?\n`),
      ),
  },

  outro: () => {
    console.log(green("Completed!"));
    console.log("Please run `deno uninstall jd` to remove this cli tool");
    console.log("Please reload or re-source your terminal window");
  },
};

/**
 * @name UninstallCommand
 *
 * @description
 * Guided script for tearing down Johnny Decimal CLI (opposite of
 * InstallCommand). This includes:
 * 1. Removing `$HOME/.jd`
 * 2. Removing the `cd` shell script and env variables from the user's config
 */
const uninstallCommand: Command = {
  name: "uninstall",
  usage: "jd uninstall",
  description: "Uninstall the `cd` script and plugin dir",

  // @todo doesn't yet remove source text from bash_profile
  async fn(this: Directory) {
    const { $HOME, $JD_HOME, $JD_DIR } = this;
    const shellConfigPath = getShellConfigPath($HOME);

    log.step1.intro($JD_DIR);

    if (log.step1.query($JD_DIR)) {
      log.step1.progress($JD_DIR);
      await Deno.remove($JD_DIR, { recursive: true })
        .then(() => log.step1.complete($JD_DIR))
        .catch((e) => log.step1.failed(e));
    }

    const jdHomeText = jdHomeTemplate
      .replace("{JD_HOME}", $JD_HOME)
      .replace($HOME, "$HOME");

    log.step2.intro(jdHomeText, shellConfigPath);

    if (confirm("Would you like us to make these changes automatically?")) {
      let contents = await Deno.readTextFile(shellConfigPath);

      if (contents.includes(sourceText)) {
        contents = contents.replace("\n" + sourceText, "");
      } else {
        log.step2.failed(sourceText);
      }

      if (contents.includes(jdHomeText)) {
        contents = contents.replace("\n" + jdHomeText, "");
      } else {
        log.step2.failed(jdHomeText);
      }

      await Deno.writeTextFile(shellConfigPath, contents);
    }
    log.outro();
  },
};

export default uninstallCommand;
