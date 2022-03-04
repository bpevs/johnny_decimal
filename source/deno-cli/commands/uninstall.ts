// @todo doesn't yet remove source text from bash_profile
export async function uninstall() {
  console.log("Deleting `~/.jd`...");
  await Deno.remove(jdDir, { recursive: true });
  console.log("~/.jd is successfully removed");
  console.log("Please reload or re-source your terminal window");
}
