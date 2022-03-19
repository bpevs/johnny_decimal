import { assert, assertEquals } from "../../deps_test.ts";
import { DirectoryCore as Directory } from "../directory_core.ts";

Deno.test("can add and run commands", async () => {
  const directory = new Directory();

  let val = 0;
  const myCommand = {
    name: "my-command",
    fn: async ([toAdd]: string[] = []) => {
      return val += Number(toAdd);
    },
    alias: ["mc"],
  };

  directory.registerCommand(myCommand);

  assert(directory.hasCommand("my-command"), "has command");

  assertEquals(await directory.runCommand("my-command", ["1"]), 1);
  assertEquals(await directory.runCommand("mc", ["3"]), 4);
});
