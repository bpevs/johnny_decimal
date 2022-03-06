import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std/testing/asserts.ts";
import { join } from "../../deps.ts";
import { Directory } from "../directory.ts";

const testHome = join(Deno.cwd(), "test");

const directory = new Directory({
  $HOME: testHome,
  $JD_HOME: join(testHome, "home"),
  $JD_DIR: join(testHome, ".jd"),
});

Deno.test("Initialization", (t) => {
  assertEquals(directory.$HOME, testHome);
  assertEquals(directory.$JD_HOME, join(testHome, "home"));
  assertEquals(directory.$JD_DIR, join(testHome, ".jd"));

  assertExists(directory.findLocations);
  assertExists(directory.findLocationsById);
  assertExists(directory.findLocationsByName);
  assertExists(directory.listAllLocations);
});

Deno.test("findLocations", async (t) => {
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
        "home/10-19 Finance/11 Tax returns/11.01 2017 returns",
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
        "home/10-19 Finance/11 Tax returns/11.01 2017 returns",
      );
    },
  });

  await t.step({
    name: "listAllLocations",
    fn: async () => {
      const locations = await directory.listAllLocations();
      assertEquals(locations.length, 11);
    },
  });
});
