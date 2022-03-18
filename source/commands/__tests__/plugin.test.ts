import { assertEquals, sinon } from "../../deps_test.ts";

import { join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import pluginCommand from "../plugin.ts";

Deno.test("Plugin Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME: join(testHome, "home"),
    $JD_DIR: join(testHome, ".jd"),
  });

  directory.registerCommand("plugins", pluginCommand);

  sinon.stub(console, "log");
  sinon.stub(directory, "setConfig");

  const log: any = console.log;
  const setConfig: any = directory.setConfig;

  await t.step("enables plugins", async () => {
    await directory.runCommand("plugins", ["enable"]);

    const [key, value] = setConfig.getCalls()[0].args;
    assertEquals(key, "pluginsEnabled");
    assertEquals(value, true);

    assertEquals(log.getCalls()[0].firstArg, "Plugins Enabled!");
  });

  log.reset();
  setConfig.reset();

  await t.step("disables plugins", async () => {
    await directory.runCommand("plugins", ["disable"]);

    const [key, value] = setConfig.getCalls()[0].args;
    assertEquals(key, "pluginsEnabled");
    assertEquals(value, false);

    assertEquals(log.getCalls()[0].firstArg, "Plugins Disabled!");
  });

  log.restore();
  setConfig.restore();
});
