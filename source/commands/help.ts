import { Directory } from "../models/directory.ts";
import { logTitle } from "../utilities/log_utilities.ts";

export default async function help(this: Directory) {
  logTitle("Johnny Decimal CLI");
  console.log(
    "\nNote:\n" +
      "  <location> refers to a Johnny Decimal location. This includes:\n" +
      "    - Area Locations: \`10-19\`\n" +
      "    - Category Locations: \`11\`\n" +
      "    - ID Locations: \`11.02\`\n\n" +
      "Usage:",
  );
  console.table({
    "jd --help": "Show this message",
    "jd [<location>]":
      "Change directory to location. If location ommitted, go to root.",
    "jd ls [<location>]": "List files in a location",
    "jd open <location>": "Open location in Finder",
    "jd index": "Show all directories in your JD filesystem",
    "jd install": "Install the `cd` script, and create plugin dir",
    "jd uninstall": "Uninstall the `cd` script and plugin dir"
  });
}
