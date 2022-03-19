import { assertEquals, assertStringIncludes, sinon } from "../../deps_test.ts";
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

  directory.registerCommand(indexCommand);

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
