import { join } from "../deps.ts";

export default function getDefaultShellName($HOME: string): string {
  const $SHELL = Deno.env.get("SHELL") || "";

  if ($SHELL.includes("zsh")) {
    return join($HOME, ".zshrc");
  }

  if ($SHELL.includes("fish")) {
    return join("$HOME", ".config/fish/config.fish");
  }

  if ($SHELL.includes("bash")) {
    return join($HOME, ".bashrc");
  }

  throw new Error(`Did not recognize default shell: ${$SHELL}`);
}
