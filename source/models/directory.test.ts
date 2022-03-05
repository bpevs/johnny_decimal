import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std/testing/asserts.ts";
import { SH_DIR } from "../constants.ts";
import { dirname, fromFileUrl, join } from "../deps.ts";
import { Directory } from "./directory.ts";

const permissions = { read: true, env: true };
const testHome = join(dirname(fromFileUrl(import.meta.url)), "testFiles");

const directory = new Directory({
  $HOME: testHome,
  homeDir: join(testHome, "home"),
  configDir: join(testHome, ".jd"),
  shDir: SH_DIR,
  defaultApp: "Finder",
});

Deno.test("Initialization", (t) => {
  assertEquals(directory.$HOME, testHome);
  assertEquals(directory.homeDir, join(testHome, "home"));
  assertEquals(directory.configDir, join(testHome, ".jd"));
  assertEquals(directory.shDir, SH_DIR);
  assertEquals(directory.defaultApp, "Finder");

  assertExists(directory.findLocations);
  assertExists(directory.findLocationsById);
  assertExists(directory.findLocationsByName);
  assertExists(directory.listAllLocations);

  assertExists(directory.commands.help);
  assertExists(directory.commands.install);
  assertExists(directory.commands.list);
  assertExists(directory.commands.open);
  assertExists(directory.commands.search);
  assertExists(directory.commands.setup);
  assertExists(directory.commands.uninstall);
});

Deno.test({ name: "findLocations", permissions }, async (t) => {
  await t.step({
    name: "findLocationsById",
    fn: async () => {
      const locations = await directory.findLocationsById("11.01");
      assertEquals(locations.length, 2);
      const location = locations[0];
      const { area, category, item, name, path } = location;
      assertEquals(area, "10-19");
      assertEquals(category, "11");
      assertEquals(item, "11.01");
      assertEquals(name, "11.01 2017 returns");
      assertStringIncludes(
        path,
        "testFiles/home/10-19 Finance/11 Tax returns/11.01 2017 returns",
      );
    },
  });

  await t.step({
    name: "findLocationsByName",
    fn: async () => {
      const locations = await directory.findLocationsByName("2017");
      assertEquals(locations.length, 1);
      const location = locations[0];
      const { area, category, item, name, path } = location;
      assertEquals(area, "10-19");
      assertEquals(category, "11");
      assertEquals(item, "11.01");
      assertEquals(name, "11.01 2017 returns");
      assertStringIncludes(
        path,
        "testFiles/home/10-19 Finance/11 Tax returns/11.01 2017 returns",
      );
    },
  });

  await t.step({
    name: "listAllLocations",
    fn: async () => {
      const locations = await directory.listAllLocations();
      assertEquals(locations.length, 11);
    }
  })
});
