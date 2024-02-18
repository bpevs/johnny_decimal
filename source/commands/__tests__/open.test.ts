import { assertEquals, sinon } from "../../deps_test.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import openCommand from "../open.ts";

Deno.test("Open Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  directory.registerCommand(openCommand);

  sinon.stub(Deno.Command.prototype, "spawn").callsFake((...args: any[]) => {
    const resp: any = { status: () => args };
    return resp;
  });

  const run: any = Deno.Command.prototype.spawn;

  await t.step("Runs Open command", async () => {
    await directory.runCommand("open", ["12.01"]);

    assertEquals(run.called, true);
    assertEquals(run.getCalls().length, 1);
  });

  run.restore();
});
