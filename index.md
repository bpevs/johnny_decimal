## Johnny Decimal CLI

This code is both a CLI for Johnny Decimal, as well as a set of portable Javascript for use in building your own Johnny Decimal Javascript applications.

### CLI

This Johnny Decimal CLI is built using [Deno](https://deno.land/).  If you don't know about Deno yet, it's basically a secure JavaScript/TypeScript runtime made in Rust. You can think of it like the next iteration of Node.js

#### Setup

The setup for using this CLI tool is simple.

1. Install [Deno](https://deno.land/#installation)
2. Run `deno install --allow-read --allow-write --allow-env --allow-run --name=jd https://deno.land/x/johnny_decimal/main.ts`

This installs the johnny_decimal application under the namespace "jd".
It allows for reading and writing to the filesystem, as well as reading environment variables and running commands. Yes, it is a lot of permissions. I will update this document shortly on what all of these individual permissions are being used for, once I organize this document into a more substantial piece of documentation.

You can then optionally install the `cd` command by running

- `jd install`

This will add a shell script to your bash profile.  I will also add an explanation for this one when I update docs.  You can always uninstall this script by running `jd uninstall`.
