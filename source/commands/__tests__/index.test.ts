import sinon from "https://cdn.skypack.dev/sinon@11.1.2?dts";
import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/testing/asserts.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import indexCommand from "../index.ts";

Deno.test("index Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(console, "log");
  const log: any = console.log;

  directory.registerCommand("index", indexCommand);

  await t.step("Logs index", async () => {
    await directory.runCommand("index", []);

    assertEquals(log.getCalls().length, 1);
    const filesLog = log.getCalls()[0].firstArg;
    assertStringIncludes(filesLog, "10-19 Finance");
    assertStringIncludes(filesLog, "11 Tax returns");
    assertStringIncludes(filesLog, "11.01 2017 returns");
  });

  log.restore();
});
