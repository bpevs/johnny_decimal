/**
 * Utilize Environment Variables for configuration settings.
 * All variables are namespaced under JD
 *
 * export JD_HOME="~/Documents"
 * export JD_DEFAULT_APP="Sublime Text"
 */
import "https://deno.land/std/dotenv/load.ts";
import { join } from "./deps.ts";

// Unix $HOME
export const $HOME = (() => {
  const home = Deno.env.get("HOME");
  if (!home) throw new Error("$HOME is undefined");
  return home;
})();

// Johnny Decimal Configs, Shell Scripts, and Plugins are housed here
export const $JD_DIR = Deno.env.get("JD_DIR") || join($HOME, ".jd");

// The root of the Johnny Decimal Filesystem
export const $JD_HOME = Deno.env.get("JD_HOME") || "";
