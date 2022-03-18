import { assertEquals, assertStringIncludes, sinon } from "../../deps_test.ts";

import { ensureDir, exists, join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import uninstallCommand from "../uninstall.ts";

Deno.test("uninstall Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");
  const $JD_DIR = join(testHome, ".jd");
  const $JD_HOME = join(testHome, "home");

  // Store state of .jd dir to restore later
  const pluginFilePath = `${$JD_DIR}/plugins/my-plugin`;
  const pluginScriptFilePath = join(pluginFilePath, "main.ts");
  const pluginContents = await Deno.readTextFile(pluginScriptFilePath);

  // Store original .zshrc contents to restore later.
  const zshrcContents = await Deno.readTextFile(join(testHome, ".zshrc"));

  // Add lines to .zshrc to imitate installed state
  await Deno.writeTextFile(
    join(testHome, ".zshrc"),
    '\nexport JD_HOME="$HOME/home"\nsource $HOME/.jd/main.sh',
    { append: true },
  );

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME,
    $JD_DIR,
  });

  sinon.stub(window, "confirm");
  sinon.stub(console, "log");
  const confirmFunc: any = confirm;
  const log: any = console.log;

  directory.registerCommand("uninstall", uninstallCommand);

  await t.step("Skips all", async () => {
    confirmFunc.returns(false);

    await directory.runCommand("uninstall", []);

    const logs = log.getCalls();
    assertStringIncludes(logs[0].firstArg, "Step 1 of 2");
    assertStringIncludes(confirmFunc.getCalls()[0].firstArg, "automatically");
    assertStringIncludes(logs[1].firstArg, "Step 2 of 2");
    assertStringIncludes(logs[1].firstArg, 'JD_HOME="$HOME/home"');
    assertStringIncludes(logs[1].firstArg, "source $HOME/.jd/main.sh");
    assertStringIncludes(confirmFunc.getCalls()[1].firstArg, "automatically?");
    assertStringIncludes(logs[2].firstArg, "Completed!");
  });

  log.reset();
  confirmFunc.reset();

  await t.step("Confirm All", async () => {
    confirmFunc.returns(true);

    assertEquals(await exists(`${testHome}/.jd`), true);
    await directory.runCommand("uninstall", []);
    assertEquals(await exists(`${testHome}/.jd`), false);

    const logs = log.getCalls();
    assertStringIncludes(logs[0].firstArg, "Step 1 of 2");
    assertStringIncludes(confirmFunc.getCalls()[0].firstArg, "automatically");
    assertStringIncludes(logs[1].firstArg, "Deleting");
    assertStringIncludes(logs[2].firstArg, "successfully removed!");
    assertStringIncludes(logs[3].firstArg, "Step 2 of 2");
    assertStringIncludes(logs[3].firstArg, 'JD_HOME="$HOME/home"');
    assertStringIncludes(logs[3].firstArg, "source $HOME/.jd/main.sh");
    assertStringIncludes(confirmFunc.getCalls()[1].firstArg, "automatically?");
    assertStringIncludes(logs[4].firstArg, "Completed!");
  });

  // Restore .jd dir
  await ensureDir(pluginFilePath);
  await Deno.writeTextFile(pluginScriptFilePath, pluginContents);

  // Restore .zshrc
  await Deno.writeTextFile(join(testHome, ".zshrc"), zshrcContents);

  log.restore();
  confirmFunc.restore();
});
