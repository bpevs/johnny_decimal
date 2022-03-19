import { assertEquals, sinon } from "../../deps_test.ts";
import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import defaultCommand from "../default.ts";

Deno.test("Default Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  sinon.stub(console, "error");
  const error: any = console.error;

  directory.registerCommand(defaultCommand);

  await t.step("Does nothing if location exists", async () => {
    await directory.runCommand("12.01", []);
    await directory.runCommand("default", ["12.01"]);

    assertEquals(error.called, false);
  });

  await t.step("Logs enoent if location does not exist", async () => {
    await directory.runCommand("99.99", []);
    await directory.runCommand("default", ["99.99"]);

    assertEquals(error.called, true);
    assertEquals(error.getCalls().length, 2);
  });

  error.restore();
});
