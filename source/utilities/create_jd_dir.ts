import { ensureDir, join } from "../deps.ts";

import.meta.resolve("./foo.js")
// Copy of shell/main.sh
const shText = `\
jd() {
  # Handle cd methods
  if [[ "$1" =~ ^[0-9]{2}-[0-9]{2}$ ]]; then
    # Matches area regex: \`dd-dd\`. Navigate to area
    cd $JD_HOME/\${1}*/ 2>/dev/null;
  elif [[ "$1" =~ ^[0-9]{2}$ ]]; then
    # Matches category regex: \`dd\`. Navigate to category
    cd $JD_HOME/*/\${1}*/ 2>/dev/null;
  elif [[ "$1" =~ ^[0-9]{2}\\.[0-9]{2}$ ]]; then
    # Matches id regex: \`dd.dd\`. Navigate to id
    cd $JD_HOME/*/*/\${1}*/ 2>/dev/null;
  elif [[ $# == 0 ]]; then
    # No arg for cd. Navigate to root.
    cd $JD_HOME 2>/dev/null;
  else
    # Not cd, so run deno script
    # Don't run in other case for performance reasons;
    # loses error handle this way, though
    $DENO_DIR/bin/jd $argv
  fi
}

`;

// Copy of shell/main.fish
const fishText = `\
function jd
  set -l SEARCH $argv[1]

  if string match -rq '^(?<category>[0-9]{2})$' $SEARCH
    # Matches category regex: \`dd\`. Navigate to category
    set -l CATEGORY (find -E $JD_HOME -regex ".*/$SEARCH .*" -depth 2 -type d) 2>/dev/null;

    test -z "$CATEGORY" && cd $JD_HOME && return 1
    cd $CATEGORY
  else if string match -rq '^(?<category>[0-9]{2})\.(?<id>[0-9]{2,4})$' $SEARCH
    # Matches id regex: \`dd.dd\`. Navigate to id
    set -l CATEGORY (find -E $JD_HOME -regex ".*/$category .*" -depth 2 -type d) 2>/dev/null;
    set -l ID (find -E $CATEGORY -regex ".*/$id ?.*" -type d ) 2>/dev/null;

    test -z "$ID" && cd $JD_HOME && return 1

    cd $ID
  else if count $argv > /dev/null
    # If there is a non-cd arg, run deno script
    $DENO_DIR/bin/jd $argv
  else
    # No arg for cd. Navigate to root.
    cd $JD_HOME 2>/dev/null;
  end
end

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

  await Deno.writeTextFile(join(pathToInstall, "main.sh"), shText);
  await Deno.writeTextFile(join(pathToInstall, "main.fish"), fishText);

  return;
}
