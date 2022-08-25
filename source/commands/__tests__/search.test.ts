import { assertStringIncludes, sinon } from "../../deps_test.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import searchCommand from "../search.ts";

Deno.test("Search Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(console, "log");
  const log: any = console.log;

  directory.registerCommand(searchCommand);

  await t.step("Logs area", async () => {
    await directory.runCommand("search", ["returns"]);

    const [titleLog, searchLog] = log.getCalls();
    assertStringIncludes(titleLog.firstArg, "Search");
    assertStringIncludes(searchLog.firstArg, "11 Tax returns");
    assertStringIncludes(searchLog.firstArg, "11.01 2017 returns");
  });

  log.restore();
});
