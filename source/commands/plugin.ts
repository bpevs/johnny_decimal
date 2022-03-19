import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";
import { logLocationFilenames } from "../utilities/log_utilities.ts";

/**
 * @description
 * Enable/Disable usage of plugins in Johnny Decimal CLI. We do this by writing
 * `pluginsEnabled: true|false` to `$HOME/.jd/config.yaml`
 */
const pluginCommand: Command = {
  name: "plugins",
  usage: "jd plugins [ enable | disable ]",
  description: "Enable or disable the usage of JD Plugins",

  async fn(this: Directory, [arg] = []) {
    if (arg === "enable") {
      await this.setConfig("pluginsEnabled", true);
      console.log("Plugins Enabled!");
      return;
    }
    if (arg === "disable") {
      await this.setConfig("pluginsEnabled", false);
      console.log("Plugins Disabled!");
      return;
    }
    console.log("Plugins Enabled: " + await this.getConfig("pluginsEnabled"));
  },
};

export default pluginCommand;
