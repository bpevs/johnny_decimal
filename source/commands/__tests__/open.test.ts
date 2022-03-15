import sinon from "https://cdn.skypack.dev/sinon@11.1.2?dts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

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

  directory.registerCommand("open", openCommand);

  sinon.stub(Deno, "run").callsFake((...args: any[]) => {
    const resp: any = { status: () => args };
    return resp;
  });

  const run: any = Deno.run;

  await t.step("Runs Open command", async () => {
    await directory.runCommand("open", ["12.01"]);

    assertEquals(run.called, true);
    assertEquals(run.getCalls().length, 1);
  });

  run.restore();
});
