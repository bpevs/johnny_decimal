/**
 * The idea is that these core modules can be used in Deno AND as a buildable
 * web dependency. Mostly for if anyone wants to use the models and
 * infrastructure to organize a web client for, say, a cms or email server or
 * something.
 *
 * In practice, this is primarily based around `Location`, which is a class
 * that we expect to override for various platforms.
 */

export * from "./types.ts";

export * from "./models/Directory.ts";
export * from "./models/Location.ts";

export * from "./utilities/idUtilities.ts";
export * from "./utilities/predicates.ts";
export * from "./utilities/sortByLocation.ts";
