# Plugin Development

## Introduction

So you want to make a plugin for JD CLI?

Plugins are imported directly by the CLI, so you have the full power of the Deno ecosystem.

If you have never used [Deno](https://deno.land/) before, you might want to consider reading [Deno Manual](https://deno.land/manual) and a gentle introduction to the runtime and it's features.

Before developing your own plugins, you'll want to read how to [install plugins](./plugin_usage.md).

::: tip
**ALL** Johnny Decimal CLI Commands (except the `cd` command) are plugins. Even the built-in ones! You can [look at the built-in commands' source code for reference](https://github.com/ivebencrazy/johnny_decimal/tree/main/source/commands) (or even override our existing commands by using the same `name`)!
:::


## Basic Structure

The easiest way to understand how plugin command works is to see an example. You can code plugins in both Javascript and Typescript. Here is an example using Javascript (or look at the released [typescript version](https://github.com/ivebencrazy/jd_plugins/tree/main/jd_plugin_sublime)):

```js
/**
 * .jd/plugins/sublime/main.js
 * 
 * Opens a location in Sublime Text!
 * `jd sublime 20.21`
 * `jd subl 20.21`
 */
const sublimeCommand = {
  name: "sublime",
  alias: [ "subl" ],
  usage: "jd subl <location>",
  description: "Open location in Sublime",

  async fn([str] = []) {
    const [location] = await this.findLocationsById(str);

    // Logs the location our command is using
    console.log(location.path);

    // Runs a global sh command `open -a "Sublime Text" {location.path}`
    await Deno.run({
      cmd: ["open", "-a", "Sublime Text", location.path],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).status();
  },
};

export default sublimeCommand;
```

The structure of this Plugin Command is something like this:

| property | description |
| --- | --- |
| `name` | Basically the key used for registering the plugin. So for this example, JD CLI will run this command if the user inputs `jd sublime`. |
| `alias` | An array of other names you can use to call this command.  So this plugin can also be used by running `jd subl` |
| `usage` | Logged in JD CLI's internal `help` command. You will see these if you run `jd --help`. |
| `description` | Logged in JD CLI's internal `help` command. You will see these if you run `jd --help`. |
| `fn` | The actual command functionality. Notice the call to `this`.  `fn` is bound to the JD Directory context. This is how we make it easy to interact with the JD filesystem. |

## Using Directory and Location

The core of making command plugins in JD CLI is understanding the usage of Directory and Location.

### Directory

In our Sublime Plugin, you'll notice the context call `await this.findLocationsById`. This is using the Johnny Decimal `Directory`. For all plugins, `this` is bound to the context of the `fn` method.

This is the main tool you interact with to use JD utilities.

### Location

This describes a location in the JD filesystem. It includes 3 separate ids for `Area`, `Category`, and `Item`.

There are mainly two entities to import:

`import { Location, Directory } from "https://deno.land/x/johnny_decimal/mod.ts"`
