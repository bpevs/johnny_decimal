export default {
  name: "myplugin",
  usage: "jd myplugin",
  description: "logs a string",
  alias: ["jdp"],
  async fn() {
    console.log("hahaha this command logs a string");
  },
};
