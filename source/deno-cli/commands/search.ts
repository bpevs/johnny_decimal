import { findFilesFromName } from "";

export async function search([str]: string[]) {
  const location = new Location(str);
  const path = await this.findPathFromLocation(location);

  if (!path || !await exists(path)) {
    const locationPath = location ? location.toString() : "Directory";
    throw new Error(`${locationPath} does not exist`);
  }

  await Deno.run({
    cmd: ["open", "-a", JD_DEFAULT_APP, path],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).status();

  logLocation("Search Results", await findFilesFromName(args[0]));
}
