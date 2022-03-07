import { Directory } from "../models/directory.ts";
import Install from "./install.ts";
import { Command } from "../models/command.ts";

export default const setupCommand: Command = {
  name: "default",

  async fn(this: Directory) {
    console.warn("This functionality requires installation of jd script");
    if (confirm("Install now?")) {
      await (new Install()).fn.call(this);
    } else {
      console.log(
        "\nYou can install at any time with `jd install`.\n" +
          "The only functionality that depends on this is `cd`\n" +
          "You can also manually install this script yourself by\n" +
          "copying `source/shell/main.sh` file from the source code, and adding\n" +
          "source ${PATH_TO_MAIN_JS}` to your bash profile.\n",
      );
    }
  }
}
