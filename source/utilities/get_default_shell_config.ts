import { join } from "../deps.ts";

export const SHELL = {
  BASH: "BASH",
  FISH: "FISH",
  ZSH: "ZSH",
};

export function getShellName() {
  const $SHELL = Deno.env.get("SHELL") || "";
  if ($SHELL.includes("zsh")) return SHELL.ZSH;
  if ($SHELL.includes("fish")) return SHELL.FISH;
  if ($SHELL.includes("bash")) return SHELL.BASH;
  throw new Error(`Did not recognize default shell: ${$SHELL}`);
}

/**
 * @description
 * Attempts to get the default shell of the user. This is primarily for use in
 * the `install` and `uninstall` commands, where we edit a user's config.
 */
export function getShellConfigPath($HOME: string): string {
  const shellName = getShellName();

  if (shellName === SHELL.ZSH) return join($HOME, ".zshrc");
  if (shellName === SHELL.FISH) return join($HOME, ".config/fish/config.fish");
  if (shellName === SHELL.BASH) return join($HOME, ".bashrc");

  throw new Error(`Did not recognize default shell: ${$SHELL}`);
}
