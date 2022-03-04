import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  getFormattedAreaId,
  getFormattedCategoryId,
  getFormattedItemId,
} from "./format_id.ts";

Deno.test("getFormattedItemId", () => {
  assertEquals(getFormattedItemId({ itemId: "23.02" }), "23.02");
  assertEquals(getFormattedItemId({ itemId: "23" }), "23.00");
});

Deno.test("getFormattedCategoryId", () => {
  assertEquals(getFormattedCategoryId({ itemId: "23" }), "23");
  assertEquals(getFormattedCategoryId({ itemId: "23.03" }), "23");
  assertEquals(getFormattedCategoryId({ categoryId: "23" }), "23");
});

Deno.test("getFormattedAreaId", () => {
  assertEquals(getFormattedAreaId({ itemId: "33.03" }), "30-39");
  assertEquals(getFormattedAreaId({ categoryId: "23" }), "20-29");
  assertEquals(getFormattedAreaId({ areaId: "20-29" }), "20-29");
});
