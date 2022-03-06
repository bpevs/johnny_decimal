import { Directory } from "../models/directory.ts";

export default async function open(this: Directory, [str]: string[]) {
  const [location] = await this.findLocationsById(str);

  await Deno.run({
    cmd: ["open", "-a", "Finder", location.path],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).status();
}
