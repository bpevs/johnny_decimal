import { Directory } from "../models/directory.ts";

// @todo doesn't yet remove source text from bash_profile
export default async function uninstall(this: Directory) {
  if (confirm("Remove all scripts and settings?")) {
    console.log("Deleting `~/.jd`...");
    await Deno.remove(this.$JD_DIR, { recursive: true });
    console.log("~/.jd is successfully removed");
    console.log("Please reload or re-source your terminal window");
  }
}
