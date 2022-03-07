import { Command } from "../models/command.ts";
import { Directory } from "../models/directory.ts";

const defaultCommand: Command = {
  name: "default",

  async fn(this: Directory) {
    console.log("The default command");
  }
}

export default defaultCommand;

// else {
//   if (!await exists(jdDir)) {
//     setup();
//   }
//   if (Location.isLocationString(command)) {
//     const location = Location.fromFilename(command);
//     const path = await findPathFromLocation(location);
//     if (!path) throw new Error("No Location Found");
//     Deno.exit(0);
//   }
// }
