import { assert, assertEquals, assertExists } from "../../deps_test.ts";
import { LocationCore as Location } from "../location_core.ts";

Deno.test("Should have static methods", () => {
  assert(Location.TYPE.AREA === "AREA");
  assert(Location.TYPE.CATEGORY === "CATEGORY");
  assert(Location.TYPE.ITEM === "ITEM");
  assertExists(Location.format.areaId);
  assertExists(Location.format.categoryId);
  assertExists(Location.format.itemId);
  assertExists(Location.regex);
  assertExists(Location.parseId);
  assertExists(Location.isAreaId);
  assertExists(Location.isCategoryId);
  assertExists(Location.isItemId);
  assertExists(Location.isLocationId);
  assertExists(Location.isAreaFilename);
  assertExists(Location.isCategoryFilename);
  assertExists(Location.isItemFilename);
  assertExists(Location.isLocationFilename);
});

Deno.test("Initializes", () => {
  const path = "~/20-29 Area/21 Category/21.02 My Item";
  const id = "21.02";
  const name = "My Item";
  const location = new Location({ path, id, name });
  assertEquals(location.name, name, "name");
  assertEquals(location.path, path, "path");
  assertEquals(location.id, id, "id");
  assertEquals(location.area, "20-29", "areaId");
  assertEquals(location.category, "21", "categoryId");
  assertEquals(location.item, "21.02", "itemId");
  assertEquals(location.depth, Location.TYPE.ITEM, "depth");
});
