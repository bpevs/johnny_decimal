import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import { logTitle } from "../utilities/log_utilities.ts";

const helpCommand: Command = {
  name: "help",
  usage: "jd --help",
  description: "Show this message",

  async fn(this: Directory) {
    logTitle("Johnny Decimal CLI");

    const commandsHelp = Object.keys(this.commands).reduce((prev, name) => {
      const { usage, description } = this.commands[name] || {};
      if (!usage || !description) return prev;
      return { ...prev, [usage]: description };
    }, {
      "jd [<location>]":
        "Change directory to location. If location ommitted, go to root.",
    });

    console.log(
      "\nNote:\n" +
        "  <location> refers to a Johnny Decimal location. This includes:\n" +
        "    - Area Locations: \`10-19\`\n" +
        "    - Category Locations: \`11\`\n" +
        "    - ID Locations: \`11.02\`\n\n" +
        "Usage:",
    );
    console.table(commandsHelp);
  },
};

export default helpCommand;
