import sinon from "https://cdn.skypack.dev/sinon@11.1.2?dts";
import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/testing/asserts.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import helpCommand from "../help.ts";

Deno.test("Help Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(console, "log");
  sinon.stub(console, "table");
  const log: any = console.log;
  const table: any = console.table;

  directory.registerCommand("help", helpCommand);
  directory.registerCommand("my-command", {
    fn: async () => {},
    name: "my-command",
    usage: "jd my-command",
    description: "my command does things",
  });

  await t.step("Does nothing if location exists", async () => {
    await directory.runCommand("help", []);

    assertEquals(log.getCalls().length, 2);
    const [titleLog, descriptionLog] = log.getCalls();
    assertStringIncludes(titleLog.firstArg, "Johnny Decimal CLI");
    assertStringIncludes(descriptionLog.firstArg, "Usage:");

    assertEquals(table.getCalls().length, 1);
    assertEquals(table.getCalls()[0].firstArg, {
      "jd --help": "Show this message",
      "jd [<location>]":
        "Change directory to location. If location ommitted, go to root.",
      "jd my-command": "my command does things",
    });
  });

  table.restore();
});
