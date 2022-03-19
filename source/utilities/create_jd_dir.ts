import { ensureDir, join } from "../deps.ts";

// Copy of shell/main.sh
const shText = `\
# Since Deno will run in a subprocess, we use bash for handling chdir.
# Until I make a more standard installation process, either:
#   1. Copypasta this code into your .zshrc or .bashrc
#   2. Source this file from one of those files (source johnny_decimal/cli.sh)

jd() {
  # Handle cd methods
  if [[ "$1" =~ ^[0-9]{2}-[0-9]{2}$ ]]; then
    # Matches area regex: \`dd-dd\`. Navigate to area
    cd $JD_HOME/\${1}*/ 2>/dev/null;
  elif [[ "$1" =~ ^[0-9]{2}$ ]]; then
    # Matches category regex: \`dd\`. Navigate to category
    cd $JD_HOME/*/\${1}*/ 2>/dev/null;
  elif [[ "$1" =~ ^[0-9]{2}\.[0-9]{2}$ ]]; then
    # Matches id regex: \`dd.dd\`. Navigate to id
    cd $JD_HOME/*/*/\${1}*/ 2>/dev/null;
  elif [ $# == 0 ]; then
    # No arg for cd. Navigate to root.
    cd $JD_HOME 2>/dev/null;
  fi

  # Deno script also handles logging around cd functionality.
  $DENO_DIR/bin/jd $*
}
`;

/**
 * @description
 * Writes the Johnny Decimal CD script to a file.  This is used because Deno
 * is run in a subprocess, so `cd` commands do not persist outside of the
 * script. This workaround adds the script as a shell script that can run
 * call our Javascript. Johnny Decimal Javascript CLI doesn't technically
 * have awareness into whether that script is running.
 */
export default async function writeJdDir(pathToInstall: string) {
  // Create $HOME/.jd/plugins
  await ensureDir(join(pathToInstall, "plugins"));

  return Deno.writeTextFile(join(pathToInstall, "main.sh"), shText);
}
