# Johnny Decimal

Importable utilities built with Typescript, for interacting with a
[Johnny Decimal](https://johnnydecimal.com/) filing system.

This document is geared for using our modules for your own Johnny Decimal
javascript applications. **For CLI usage and Plugin Development information, use
our [CLI guide](https://johnny.bpev.me)**

## API Documentation

Mostly, the code comments should be sufficient; these are used to generate our
[Deno Docs](https://doc.deno.land/https/deno.land/x/johnny_decimal/mod.ts)

## Getting Started

You can import the utilities used in the CLI from deno.land:

```js
import {
  // Directory and Location are Deno-specific imports are good for fs usecases
  Directory,
  DirectoryCore,
  // Commands exported from johnny_decimal are all Deno-specific.
  // These are the apis used for the Johnny Decimal CLI
  helpCommand,
  Location,
  // LocationCore and DirectoryCore are much more bare, but are pure javascript.
  // Better when aiming to compile for web
  LocationCore,
  openCommand,
} from "https://deno.land/x/johnny_decimal/mod.ts";

const directory = new Directory({
  $HOME: $HOME,
  $JD_HOME: $JD_HOME,
  $JD_DIR: $JD_DIR,
});

// DirectoryCore still includes command-management functionality.
directory.registerCommand("default", defaultCommand);

// LocationCore still includes lots of utility functions
console.log(LocationCore.isAreaId("21.04")); // false

directory.runCommand("default", []);
```
