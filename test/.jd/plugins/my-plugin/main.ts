export default {
  name: "my-jd-plugin",
  description: "name that appears in help",
  alias: [ "jdp" ],
  async fn() {
    console.log("hahaha this command logs a string");
  }
}
