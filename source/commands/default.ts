import { Directory } from "../models/directory.ts";

export default async function defaultCommand(this: Directory) {
  console.log("The default command");
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
