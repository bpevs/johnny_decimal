/**
 * Utilize Environment Variables for configuration settings.
 * All variables are namespaced under JD
 *
 * export JD_HOME="~/Documents"
 * export JD_DEFAULT_APP="Sublime Text"
 */
import "https://deno.land/std@0.127.0/dotenv/load.ts";
import { config } from "https://deno.land/std@0.127.0/dotenv/mod.ts";

const JD_HOME: string = "JD_HOME";
const JD_DEFAULT_APP: string = "JD_DEFAULT_APP";

/**
 * Set a default app to open location directories
 */
export function getDefaultApp(): string {
  return Deno.env.get(JD_DEFAULT_APP) || "Finder";
}

/**
 * Set a default app to open location directories
 */
export function getHome(): string {
  return Deno.env.get(JD_HOME) || "~";
}
