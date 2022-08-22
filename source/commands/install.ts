import { bold, green, join, red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import createJdDir from "../utilities/create_jd_dir.ts";
import {
  getShellConfigPath,
  getShellName,
  SHELL,
} from "../utilities/get_default_shell_config.ts";
const { FISH, ZSH, BASH } = SHELL;

const JD_HOME_TEXT = {
  [BASH]: 'export JD_HOME="{JD_HOME}"',
  [ZSH]: 'export JD_HOME="{JD_HOME}"',
  [FISH]: 'set -l JD_HOME "{JD_HOME}"',
};

const SOURCE_TEXT = {
  [BASH]: "source $HOME/.jd/main.sh",
  [ZSH]: "source $HOME/.jd/main.sh",
  [FISH]: "source $HOME/.jd/main.sh",
};

const shellName = getShellName();
const jdHomeTemplate = JD_HOME_TEXT[shellName];
const sourceText = SOURCE_TEXT[shellName];

if (!jdHomeTemplate || !sourceText) {
  throw new Error(`Unsupported Shell: ${shellName}`);
}

const log = {
  intro: () =>
    console.log(bold(
      "\n" +
        "Thanks for using Johnny Decimal CLI!\n" +
        "This is a short (3 step) setup guide!\n" +
        "More detailed instructions are in the online docs:\n" +
        "https://ivebencrazy.github.io/johnny_decimal\n",
    )),

  step1: {
    intro: () =>
      console.log(
        bold(green("\nStep 1 of 3")) + "\nJD CLI needs to create " +
          "a directory for storing settings, plugins, and scripts." +
          'To start, this will only contain our "cd" script (~/.jd/main.sh)',
      ),
    query: ($JD_DIR: string) =>
      confirm(bold(`Let us create directory \`${$JD_DIR}\` automatically?`)),
    complete: () => console.log(green("Created!")),
    failed: () => console.log(red("\nFailed! Maybe `.jd` already exists?")),
  },

  step2: {
    intro: (): string =>
      console.log(
        bold(green("\nStep 2 of 3\n")) +
          "We need to know where your JD filesystem is located!\n" +
          "This is the directory that contains all your JD Areas.",
      ),
    query: ($HOME: string) =>
      prompt(bold("\nWhere is your Johnny Decimal filesystem's home?"), $HOME),
  },

  step3: {
    intro: (jdHomeText: string, shellConfigPath: string, sourceText: string) =>
      console.log(
        `\n${bold(green("Step 3 of 3"))}\n` +
          `JD CLI needs the following lines to be added to ${shellConfigPath}:\n` +
          `\n      ${green("+")} ${jdHomeText}` +
          `\n      ${green("+")} ${sourceText}`,
      ),
    query: () => confirm(bold("Would you like us to add these automatically?")),
  },

  outro: () => {
    console.log(bold(green("Setup Complete!\n")));
    console.log("Please reload or re-source your terminal window.");
    console.log("You can undo changes done by this setup script later.");
    console.log("Just run: `jd uninstall`\n");
  },

  skip: () => console.log("\n  Skipping..."),
};

/**
 * @name InstallCommand
 *
 * @description
 * Guided script for setting up Johnny Decimal CLI. This includes:
 * 1. Creating `$HOME/.jd`
 * 2. Registering a user's Johnny Decimal Filesystem
 * 3. Adding the `cd` shell script and environment variables to user's config.
 */
const installCommand: Command = {
  name: "install",
  usage: "jd install",
  description: "Install the `cd` script, and create plugin dir",

  async fn(this: Directory) {
    const { $HOME, $JD_DIR } = this;
    const shellConfigPath = getShellConfigPath($HOME);

    log.intro();

    // Create .jd
    log.step1.intro();

    if (log.step1.query($JD_DIR)) {
      try {
        await createJdDir(join($JD_DIR));
        log.step1.complete();
      } catch (e) {
        log.step1.failed();
      }
    } else {
      log.skip();
    }

    // Get JD Home Dir
    log.step2.intro();

    const $JD_HOME = (log.step2.query($HOME) || $HOME)
      .replace("~", $HOME)
      .replace($HOME, "$HOME");
    const jdHomeText = jdHomeTemplate.replace("{JD_HOME}", $JD_HOME);

    // Edit sh config
    log.step3.intro(jdHomeText, shellConfigPath, sourceText);

    if (log.step3.query()) {
      const config = await Deno.readTextFile(shellConfigPath);
      let nextConfig = "";

      if (
        (shellName === FISH && config.includes("set -l JD_HOME")) ||
        ([BASH, ZSH].includes(shellName) && config.includes("export JD_HOME="))
      ) {
        console.log(red("\n`export JD_HOME=` already exists!"));
        log.skip();
      } else {
        nextConfig += jdHomeText + "\n";
      }

      if (config.includes(sourceText)) {
        console.log(red(`\n\`${sourceText}\` already exists!`));
        log.skip();
      } else {
        nextConfig += sourceText + "\n";
      }

      const data = (new TextEncoder()).encode("\n" + nextConfig);
      await Deno.writeFile(shellConfigPath, data, { append: true });
    } else {
      log.skip();
    }

    log.outro();
  },
};

export default installCommand;
