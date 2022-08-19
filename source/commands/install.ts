import { bold, green, join, red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import createJdDir from "../utilities/create_jd_dir.ts";
import { SHELL, getShellName, getShellConfigPath } from "../utilities/get_default_shell_config.ts";

const shellName = getShellName();
const shellConfigPath = getShellConfigPath($HOME);

const JD_HOME_TEXT = {
  [SHELL.BASH]: 'export JD_HOME="{JD_HOME}"',
  [SHELL.ZSH]: 'export JD_HOME="{JD_HOME}"',
  [SHELL.FISH]: 'set -l JD_HOME "{JD_HOME}"',
}

const SOURCE_TEXT = {
  [SHELL.BASH]: "source $HOME/.jd/main.sh",
  [SHELL.ZSH]: "source $HOME/.jd/main.sh",
  [SHELL.FISH]: "source $HOME/.jd/main.sh",
}

const jdHomeText = JD_HOME_TEXT[shellName];
const sourceText = SOURCE_TEXT[shellName];
if (!jdHomeText || !sourceText) throw new Error(`Unsupported Shell: ${shellName}`)

const intro = bold(`
Thanks for using Johnny Decimal CLI!
This is a short (3 step) setup guide!`);

const introLink = `
More detailed instructions are in the online docs:
https://ivebencrazy.github.io/johnny_decimal`;

const step1 = `
${bold(green("Step 1 of 3"))}
JD CLI needs to create a directory for storing settings, plugins, and scripts.
To start, this will only contain our "cd" script (~/.jd/main.sh)
`;

const step2 = bold(green("\nStep 2 of 3\n")) +
  "We need to know where your JD filesystem is located!\n" +
  "This is the directory that contains all your JD Areas.";

const step3 = `
${bold(green("Step 3 of 3"))}
JD CLI needs the following lines to be added to {config}:

  ${green("+")} ${jdHomeText}
  ${green("+")} ${sourceText}

`;

const skipText = "\n  Skipping...";

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
    console.log(intro);
    console.log(introLink);

    const { $HOME, $JD_DIR } = this;

    console.log(step1);
    if (
      confirm(bold(`Let us create directory \`${$JD_DIR}\` automatically?`))
    ) {
      try {
        await createJdDir(join($JD_DIR));
        console.log(green("Created!"));
      } catch (e) {
        console.log(red("\nFailed! Maybe `.jd` already exists?"));
      }
    } else {
      console.log(skipText);
    }

    console.log(step2);
    const homeDirPrompt = bold(
      "\nWhere is your Johnny Decimal filesystem's home?",
    );
    const homeDirAnswer = prompt(homeDirPrompt, $HOME) || $HOME;
    const $JD_HOME = homeDirAnswer.replace("~", $HOME).replace($HOME, "$HOME");

    const explainer = step3
      .replace("{config}", shellConfigPath)
      .replace("{JD_HOME}", $JD_HOME);

    console.log(explainer);

    if (confirm(bold("Would you like us to add these automatically?"))) {
      const contents = await Deno.readTextFile(shellConfigPath);

      let newContents = "";

      switch (shellName) {
        case SHELL.FISH:
          if (contents.includes("")) {

          } else {
            const completeJdHomeText = jdHomeText.replace("{JD_HOME}", $JD_HOME);
          }

        case SHELL.BASH:
        case SHELL.ZSH:
        default: {
          if (contents.includes("export JD_HOME=")) {
            console.log(red("\n`export JD_HOME=` already exists!"));
            console.log(skipText);
          } else {
            const completeJdHomeText = jdHomeText.replace("{JD_HOME}", $JD_HOME);
            newContents += completeJdHomeText + "\n";
          }
        }
      }

      if (contents.includes(sourceText)) {
        console.log(red(`\n\`${sourceText}\` already exists!`));
        console.log(skipText);
      } else {
        newContents += sourceText + "\n";
      }

      const data = (new TextEncoder()).encode("\n" + newContents);
      await Deno.writeFile(shellConfigPath, data, { append: true });
    } else {
      console.log(skipText);
    }

    console.log(bold(green("Setup Complete!\n")));
    console.log("Please reload or re-source your terminal window.");
    console.log("You can undo changes done by this setup script later.");
    console.log("Just run: `jd uninstall`\n");
  },
};

export default installCommand;
