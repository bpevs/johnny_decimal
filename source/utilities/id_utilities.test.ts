import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std/testing/asserts.ts";

import {
  isAreaFilename,
  isAreaId,
  isCategoryFilename,
  isCategoryId,
  isItemFilename,
  isItemId,
  isLocationFilename,
  isLocationId,
  parseId,
  regex,
} from "./id_utilities.ts";

const itemId = "23.04";
const categoryId = "23";
const areaId = "20-29";
const otherNumberId = "1235";

const itemFilename = "23.04 my-item-filename";
const categoryFilename = "23 my-category-filename";
const areaFilename = "20-29 my-area-filename";
const otherNumberFilename = "1235 some-other-file";

Deno.test("regex.matchId - item", () => {
  const match = regex.matchId(itemId);
  assertMatch("/" + itemFilename, match);
  assertNotMatch("23.05", match);
});

Deno.test("regex.matchId - category", () => {
  const match = regex.matchId(categoryId);
  assertMatch("/" + categoryFilename, match);
  assertNotMatch("23.05", match);
  assertNotMatch("24", match);
  assertNotMatch(areaId, match);
});

Deno.test("regex.matchId - area", () => {
  const match = regex.matchId(areaId);
  assertMatch("/" + areaFilename, match);
  assertNotMatch("23.05", match);
});

Deno.test("regex.area", () => {
  const { area } = regex;
  assertNotMatch(itemId, area, "area regex matches item");
  assertNotMatch(categoryId, area, "area regex matches category");
  assertMatch(areaId, area, "area regex does not match area");
  assertNotMatch(otherNumberId, area, "area regex matches other");
});

Deno.test("regex.category", () => {
  const { category } = regex;
  assertNotMatch(itemId, category, "category regex matches item");
  assertMatch(categoryId, category, "category regex doesn't match category");
  assertNotMatch(areaId, category, "category regex matches area");
  assertNotMatch(otherNumberId, category, "category regex matches other");
});

Deno.test("regex.item", () => {
  const { item } = regex;
  assertMatch(itemId, item, "item regex doesn't match item");
  assertNotMatch(categoryId, item, "item regex matches category");
  assertNotMatch(areaId, item, "item regex matches area");
  assertNotMatch(otherNumberId, item, "item regex matches other");
});

Deno.test("parseId", () => {
  assertEquals(parseId(itemFilename), itemId);
  assertEquals(parseId(categoryFilename), categoryId);
  assertEquals(parseId(areaFilename), areaId);
  // @todo - assertThrows(parseId(otherNumberFilename))
});

Deno.test("isAreaId", () => {
  assert(isAreaId(itemId) === false);
  assert(isAreaId(categoryId) === false);
  assert(isAreaId(areaId));
  assert(isAreaId(otherNumberId) === false);
});

Deno.test("isCategoryId", () => {
  assert(isCategoryId(itemId) === false);
  assert(isCategoryId(categoryId));
  assert(isCategoryId(areaId) === false);
  assert(isCategoryId(otherNumberId) === false);
});

Deno.test("isItemId", () => {
  assert(isItemId(itemId));
  assert(isItemId(categoryId) === false);
  assert(isItemId(areaId) === false);
  assert(isItemId(otherNumberId) === false);
});

Deno.test("isLocationId", () => {
  assert(isLocationId(itemId));
  assert(isLocationId(categoryId));
  assert(isLocationId(areaId));
  assert(isLocationId(otherNumberId) === false);
});

Deno.test("isAreaFilename", () => {
  assert(isAreaFilename(itemFilename) === false);
  assert(isAreaFilename(categoryFilename) === false);
  assert(isAreaFilename(areaFilename));
  assert(isAreaFilename(otherNumberFilename) === false);
});

Deno.test("isCategoryFilename", () => {
  assert(isCategoryFilename(itemFilename) === false);
  assert(isCategoryFilename(categoryFilename));
  assert(isCategoryFilename(areaFilename) === false);
  assert(isCategoryFilename(otherNumberFilename) === false);
});

Deno.test("isItemFilename", () => {
  assert(isItemFilename(itemFilename));
  assert(isItemFilename(categoryFilename) === false);
  assert(isItemFilename(areaFilename) === false);
  assert(isItemFilename(otherNumberFilename) === false);
});

Deno.test("isLocationFilename", () => {
  assert(isLocationFilename(itemFilename));
  assert(isLocationFilename(categoryFilename));
  assert(isLocationFilename(areaFilename));
  assert(isLocationFilename(otherNumberFilename) === false);
});
