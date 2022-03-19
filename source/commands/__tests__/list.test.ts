import { assertEquals, assertStringIncludes, sinon } from "../../deps_test.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import listCommand from "../list.ts";

/**
 * @todo
 * - test: List working dir
 * - test: List Home
 */
Deno.test("list Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(console, "log");
  const log: any = console.log;

  directory.registerCommand(listCommand);

  await t.step("Logs area", async () => {
    await directory.runCommand("list", ["10-19"]);

    const [titleLog, listLog] = log.getCalls();
    assertStringIncludes(titleLog.firstArg, "10-19 Finance");
    assertStringIncludes(listLog.firstArg, "11 Tax returns");
  });

  log.reset();

  await t.step("Logs category", async () => {
    await directory.runCommand("list", ["11"]);

    const [titleLog, listLog] = log.getCalls();
    assertStringIncludes(titleLog.firstArg, "11 Tax returns");
    assertStringIncludes(listLog.firstArg, "11.01 2017 returns");
  });

  log.reset();

  await t.step("Logs item", async () => {
    await directory.runCommand("list", ["11.01"]);

    const [titleLog, listLog] = log.getCalls();
    assertStringIncludes(titleLog.firstArg, "11.01 2017 returns");
    assertStringIncludes(listLog.firstArg, "my-file.md");
  });

  log.restore();
});
