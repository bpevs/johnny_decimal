import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DirectoryCore as Directory } from "../directory_core.ts";

Deno.test("can add and run commands", async () => {
  const directory = new Directory();

  let val = 0;
  const myCommand = ([toAdd]: string[]) => val += Number(toAdd);
  const getCommand = async () => ({ default: myCommand });

  directory.registerCommand("my-command", getCommand);
  directory.registerAlias("my-command", ["mc"]);

  assert(directory.hasCommand("my-command"), "has command");

  assertEquals(await directory.runCommand("my-command", ["1"]), 1);
  assertEquals(await directory.runCommand("mc", ["3"]), 4);
});
