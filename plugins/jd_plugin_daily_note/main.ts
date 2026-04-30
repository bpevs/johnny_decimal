import {
  Command,
  Directory,
} from "https://deno.land/x/johnny_decimal@1.0.3/mod.ts";
import { ensureDir, ensureFile } from "https://deno.land/std/fs/mod.ts";
import { basename, join } from "https://deno.land/std/path/mod.ts";

import getDailyNoteDir from "../shared/get_daily_note_dir.ts";
import openInSublime from "../shared/open_in_sublime.ts";

/**
 * @description Opens a location using the default file explorer
 */
const dailyNoteCommand: Command = {
  name: "daily",
  usage: "jd daily [2021-03-02 | tomorrow | yesterday]",
  description: "Creates and/or edit to a day's daily note",

  async fn(this: Directory, [name]: string[] = []) {
    const dailyNoteDir = getDailyNoteDir(this.$JD_HOME, name);
    const dailyNoteName = basename(dailyNoteDir);

    await ensureDir(join(dailyNoteDir, "attachments"));

    // Setup Journal
    const journalPath = join(dailyNoteDir, "JOURNAL.md");
    await ensureFile(journalPath);
    const journalText = await Deno.readTextFile(journalPath);
    if (!journalText) {
      await Deno.writeTextFile(
        journalPath,
        writeDailyJounalFileFromDate(dailyNoteName),
      );
    }

    await openInSublime(journalPath);
  },
};

function writeDailyJounalFileFromDate(name: string) {
  return `\
---
date: ${name}
tags: [ dailynote ]
---
# ${name}

## Links
----
`;
}

export default dailyNoteCommand;
