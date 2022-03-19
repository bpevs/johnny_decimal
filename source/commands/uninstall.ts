import { bold, green, join, red } from "../deps.ts";
import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import getDefaultShellName from "../utilities/get_default_shell_config.ts";

const jdHomeText = 'export JD_HOME="{JD_HOME}"';
const sourceText = "source $HOME/.jd/main.sh";

const step1 = `
${bold(green("Step 1 of 2"))}
{JD_HOME} contains settings, scripts, and plugins.
`;

const step2 = `
${bold(green("Step 2 of 2"))}
To delete JD CLI, please remove the following lines from {config}:

  ${red("-")} ${jdHomeText}
  ${red("-")} ${sourceText}

`;

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

    console.log(step1.replace("{JD_HOME}", $JD_HOME));
    if (confirm(`Would you like to delete \`~/.jd\` automatically?`)) {
      console.log(`Deleting ${$JD_DIR}...`);
      try {
        await Deno.remove($JD_DIR, { recursive: true });
        console.log(green(`${$JD_DIR} is successfully removed!`));
      } catch (e) {
        console.log(red("Failed! Did you already remove `.jd`?\n"));
      }
    }

    const rcFilepath = getDefaultShellName($HOME);

    const jdHome = $JD_HOME.replace($HOME, "$HOME");

    console.log(
      step2.replace("{config}", rcFilepath).replace("{JD_HOME}", jdHome),
    );
    if (confirm("Would you like us to make these changes automatically?")) {
      let contents = await Deno.readTextFile(rcFilepath);

      if (contents.includes(sourceText)) {
        contents = contents.replace("\n" + sourceText, "");
      } else {
        console.log(
          red(`Cannot find \`${sourceText}\`!  Did you already remove it?\n`),
        );
      }

      const actualJdHomeText = jdHomeText.replace("{JD_HOME}", jdHome);
      if (contents.includes(actualJdHomeText)) {
        contents = contents.replace("\n" + actualJdHomeText, "");
      } else {
        console.log(
          red(
            `Cannot find \`${actualJdHomeText}\`!  Did you already remove it?\n`,
          ),
        );
      }

      await Deno.writeTextFile(rcFilepath, contents);
    }

    console.log(green("Completed!"));
    console.log("Please run `deno uninstall jd` to remove this script");
    console.log("Please reload or re-source your terminal window");
  },
};

export default uninstallCommand;
