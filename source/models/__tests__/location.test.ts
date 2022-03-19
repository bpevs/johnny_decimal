import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";
import { assert, assertArrayIncludes, assertExists } from "../../deps_test.ts";
import { Location } from "../location.ts";

Deno.test("get contents", async () => {
  const location = new Location({
    name: "12.02 models",
    path: dirname(fromFileUrl(import.meta.url)),
  });

  assertArrayIncludes(await location.getContents(), [{
    isDirectory: false,
    isFile: true,
    isSymlink: false,
    name: "location.test.ts",
  }]);
});
