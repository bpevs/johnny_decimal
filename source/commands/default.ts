import { Directory } from "../models/directory.ts";
import { Command } from "../models/command.ts";

export default const defaultCommand: Command = {
  name: "default",

  async fn(this: Directory) {
    console.log("The default command");
  }
}

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
