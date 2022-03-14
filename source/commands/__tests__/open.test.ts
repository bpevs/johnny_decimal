import sinon from "https://cdn.skypack.dev/sinon@11.1.2?dts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import openCommand from "../open.ts";

Deno.test("open command runs", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(Deno, "run").callsFake((...args: any[]) => {
    const resp: any = { status: () => args };
    return resp;
  });

  await t.step("Run command", async () => {
    directory.registerCommand("open", openCommand);
    await directory.runCommand("open", ["12.01"]);

    assertEquals((Deno.run as any).called, true);
    assertEquals((Deno.run as any).getCalls().length, 1);
  });

  (Deno.run as any).restore();
});
