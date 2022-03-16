import { assertEquals, assertStringIncludes, sinon } from "../../deps_test.ts";

import { exists, join } from "../../deps.ts";
import { Directory } from "../../models/directory.ts";
import installCommand from "../install.ts";

/**
 * @todo
 * - test: install working dir
 * - test: install Home
 */
Deno.test("install Command", async (t) => {
  const testHome = join(Deno.cwd(), "test");
  const $JD_DIR = join(testHome, ".jd");
  const $JD_HOME = join(testHome, "home");

  // Store original .zshrc contents to restore later.
  const zshrcContents = await Deno.readTextFile(join(testHome, ".zshrc"));

  const directory = new Directory({
    $HOME: testHome,
    $JD_HOME,
    $JD_DIR,
  });

  sinon.stub(window, "confirm");
  sinon.stub(window, "prompt");
  sinon.stub(console, "log");
  const confirmFunc: any = confirm;
  const promptFunc: any = prompt;
  const log: any = console.log;

  directory.registerCommand("install", installCommand);

  await t.step("Skips all", async () => {
    confirmFunc.returns(false)
    promptFunc.returns("")

    await directory.runCommand("install", []);

    const logs = log.getCalls();
    assertStringIncludes(logs[0].firstArg, "Thanks for using Johnny Decimal");
    assertStringIncludes(logs[1].firstArg, "github.io/johnny_decimal");
    assertStringIncludes(logs[2].firstArg, "Step 1 of 3");
    assertStringIncludes(confirmFunc.getCalls()[0].firstArg, "Let us create");
    assertStringIncludes(logs[3].firstArg, "Skipping...");
    assertStringIncludes(logs[4].firstArg, "Step 2 of 3");
    assertStringIncludes(promptFunc.getCalls()[0].firstArg, "Where is");
    assertStringIncludes(logs[5].firstArg, ".zshrc");
    assertStringIncludes(logs[5].firstArg, `JD_HOME="$HOME"`);
    assertStringIncludes(confirmFunc.getCalls()[1].firstArg, "automatically?");
    assertStringIncludes(logs[6].firstArg, "Skipping...");
    assertStringIncludes(logs[7].firstArg, "Setup Complete!");
  });

  log.reset();
  confirmFunc.reset();
  promptFunc.reset();

  await t.step("Confirm all", async () => {
    confirmFunc.returns(true)
    promptFunc.returns("~")

    assertEquals(await exists(join($JD_DIR, "main.sh")), false);
    await directory.runCommand("install", []);
    assertEquals(await exists(join($JD_DIR, "main.sh")), true);

    const editedZshrc = await Deno.readTextFile(join(testHome, ".zshrc"));
    assertStringIncludes(editedZshrc, `export JD_HOME="$HOME"`);
    assertStringIncludes(editedZshrc, `source $HOME/.jd/main.sh`);

    const logs = log.getCalls();
    assertStringIncludes(logs[0].firstArg, "Thanks for using Johnny Decimal");
    assertStringIncludes(logs[1].firstArg, "github.io/johnny_decimal");
    assertStringIncludes(logs[2].firstArg, "Step 1 of 3");
    assertStringIncludes(confirmFunc.getCalls()[0].firstArg, "Let us create");
    assertStringIncludes(logs[3].firstArg, "Created!");
    assertStringIncludes(logs[4].firstArg, "Step 2 of 3");
    assertStringIncludes(promptFunc.getCalls()[0].firstArg, "Where is");
    assertStringIncludes(logs[5].firstArg, ".zshrc");
    assertStringIncludes(logs[5].firstArg, `JD_HOME="$HOME"`);
    assertStringIncludes(confirmFunc.getCalls()[1].firstArg, "automatically?");
    assertStringIncludes(logs[6].firstArg, "Setup Complete!");
  });

  log.reset();
  confirmFunc.reset();
  promptFunc.reset();

  await t.step("Confirm all - Already Existing", async () => {
    confirmFunc.returns(true)
    promptFunc.returns("~")

    await directory.runCommand("install", []);

    const logs = log.getCalls();
    assertStringIncludes(logs[0].firstArg, "Thanks for using Johnny Decimal");
    assertStringIncludes(logs[1].firstArg, "github.io/johnny_decimal");
    assertStringIncludes(logs[2].firstArg, "Step 1 of 3");
    assertStringIncludes(confirmFunc.getCalls()[0].firstArg, "Let us create");
    assertStringIncludes(logs[3].firstArg, "Created!");
    assertStringIncludes(logs[4].firstArg, "Step 2 of 3");
    assertStringIncludes(promptFunc.getCalls()[0].firstArg, "Where is");
    assertStringIncludes(logs[5].firstArg, ".zshrc");
    assertStringIncludes(logs[5].firstArg, `JD_HOME="$HOME"`);
    assertStringIncludes(confirmFunc.getCalls()[1].firstArg, "automatically?");
    assertStringIncludes(logs[6].firstArg, "already exists!");
  });

  // Remove generated main.sh
  await Deno.remove(join($JD_DIR, "main.sh"));

  // Restore .zshrc
  await Deno.writeTextFile(join(testHome, ".zshrc"), zshrcContents);


  log.restore();
  confirmFunc.restore();
  promptFunc.restore();
});
