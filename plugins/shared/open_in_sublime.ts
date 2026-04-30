export default async function openInSublime(pathToOpen: string) {
  await Deno.run({
    cmd: ["open", "-a", "Sublime Text", pathToOpen],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).status();
}
