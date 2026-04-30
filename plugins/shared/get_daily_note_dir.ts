import { join } from "https://deno.land/std/path/mod.ts";

/**
 * Get the directory that houses today's daily note
 *
 * Basically the path:
 * 10.01 Daily Notes/{YYYY-MM-DD}/
 *
 * @param $JD_HOME - the root dir of the johnny decimal filesystem
 * @param name - YYYY-MM-DD string OR any number of aliases:
 *   "tomorrow", "yesterday", "today"
 */
export default function getDailyNoteDir($JD_HOME: string, name?: string) {
  return join(
    $JD_HOME,
    "10-19\ Notes",
    "10\ Daily\ Reference\ Notes",
    "10.01\ Daily\ Notes",
    getDateString(name),
  );
}

function getDateString(name?: string) {
  let date = new Date();

  if (name === "yesterday") {
    date.setDate(date.getDate() - 1);
  } else if (name === "tomorrow") {
    date.setDate(date.getDate() + 1);
  } else if (name && isValidDate(name)) {
    // Already a date string, so return string
    return name;
  }

  // Adjust to user timezone
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset * 60 * 1000));

  // Format to yyyy-mm-dd
  return date.toISOString().split("T")[0];
}

// https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
function isValidDate(dateString: string) {
  let regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  let d = new Date(dateString);
  let dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}
