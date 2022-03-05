import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DirectoryCore as Directory } from "./directory_core.ts";

Deno.test("can add and run commands", async () => {
  const directory = new Directory();

  let val = 0;
  const myCommand = ([ toAdd ]: string[]) => val += Number(toAdd);

  directory.registerCommand("my-command", myCommand);
  directory.registerAlias("mc", "my-command");
  console.log(directory.commands)
  assert(directory.hasCommand("my-command"), "has command");

  assertEquals(directory.runCommand("my-command", ["1"]), 1);
  assertEquals(directory.runCommand("mc", ["3"]), 4);
});
