# Johnny Decimal

Utilities built with Typescript, for interacting with a
[Johnny Decimal](https://johnnydecimal.com/) filing system.

See docs for this repo at https://ivebencrazy.github.io/johnny_decimal

## CLI

Utilizes all the modules to create a johnny decimal cli tool.


### Usage

Install the script using Deno.

```sh
deno install --allow-env --allow-read --allow-run --allow-write --name=jd https://deno.land/x/johnny_decimal@0.1.3/main.ts

```

The first time your run the command `jd`, the Johnny Decimal CLI will guide you through setup!
After that, you can see a description of the commands using:

```sh
jd --help
```

## Modules

You can import the utilities used in the CLI from deno.land:

```js

import { Location, Directory } from "https://deno.land/x/johnny_decimal";

```

More API Docs to come...
