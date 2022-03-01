import { bold } from "https://deno.land/std@0.127.0/fmt/colors.ts";

export function logDir(
  name: string,
  contents: Array<Deno.DirEntry>,
) {
  let str = `\n${bold(name)}\n===\n`;
  str += contents.map(({ name }) => name).join("\n");
  str += "\n";
  console.log(str);
}
