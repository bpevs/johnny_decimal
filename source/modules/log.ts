import { bold } from "https://deno.land/std@0.127.0/fmt/colors.ts";
import { Location } from "./Location.ts";

const { AREA, CATEGORY, ID } = Location.TYPE;
const indent = "  ";

// @todo: See additional sort and log issues with `jd search 1`
export function logFiles(
  name: string,
  contents: Array<Deno.DirEntry>,
) {
  const numDepths = contents.reduce((prev, { name }) => {
    if (!Location.isLocationString(name)) return prev;
    const location = Location.fromFilename(name);
    const [area, category, id] = prev;
    return [
      area || location.depth === AREA,
      category || location.depth === CATEGORY,
      id || location.depth === ID,
    ];
  }, [false, false, false]).filter(Boolean).length;

  const contentsString = contents.map(({ name }) => {
    if (numDepths <= 1) return name;
    if (!Location.isLocationString(name)) return name;

    const location = Location.fromFilename(name);
    if (location.depth === AREA) return name;
    if (location.depth === CATEGORY) {
      if (numDepths === 3) return indent + name;
    }
    if (location.depth === ID) {
      if (numDepths === 3) return indent + indent + name;
      if (numDepths === 2) return indent + name;
    }
    return name;
  }).join("\n");

  let str = `\n${bold(name)}\n===\n`;
  str += contentsString;
  str += "\n";
  console.log(str);
}
