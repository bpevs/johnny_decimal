/**
 * Utilize Environment Variables for configuration settings.
 * All variables are namespaced under JD
 *
 * export JD_HOME="~/Documents"
 * export JD_DEFAULT_APP="Sublime Text"
 */
import "https://deno.land/std/dotenv/load.ts";
import { config, dirname, fromFileUrl, join } from "./deps.ts";

// ~/.jd is used for installation script
export const HOME_DIR = Deno.env.get("HOME") || "~";

export const JD_CONFIG_DIR = join(HOME_DIR, ".jd") || "~";
export const JD_DEFAULT_APP = Deno.env.get("JD_DEFAULT_APP") || "Finder";
export const JD_FILESYSTEM_DIR = Deno.env.get("JD_HOME") || "~";

export const SH_DIR = join(dirname(fromFileUrl(import.meta.url)), "./shell");
