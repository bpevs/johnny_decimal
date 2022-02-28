import { bold, red } from "https://deno.land/std@0.127.0/fmt/colors.ts";
import { Location } from "./Location.ts";

const { AREA, CATEGORY, ID } = Location.TYPE;

export type FileData = {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
};

const sortByName = (a: FileData, b: FileData) => a.name.localeCompare(b.name);

export function logLocationContents(dir: FileData[], location?: Location) {
  const { depth } = location || {};
  const sortedDir = dir.sort(sortByName);

  sortedDir.forEach(({ name, isFile, isDirectory }) => {
    const isHidden = name[0] === ".";
    if (isHidden) return;

    const shouldHaveJdDirs = depth === AREA || depth === CATEGORY;
    const isPoorForm = (isDirectory && depth === ID) ||
      (shouldHaveJdDirs && isFile) ||
      (shouldHaveJdDirs && !Location.isLocationString(name));

    // Files in this dir are an error
    if (isPoorForm) {
      console.log(bold(red(name)));
    } else {
      console.log(name);
    }
  });
}
