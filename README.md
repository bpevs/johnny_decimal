# Johnny Decimal

Utilities built with Typescript, for interacting with a
[Johnny Decimal](https://johnnydecimal.com/) filing system.

See docs at https://ivebencrazy.github.io/johnny_decimal

## Modules

This repo is not yet hosted anywhere, so this code is not quite accessible yet.

## CLI

Utilizes all the modules to create a johnny decimal cli tool.

### Installation

This is still a bit awkward. TODO is to clean up the install process.

Three steps.

1. Install javascript cli tool :

```sh
deno install --allow-read --allow-env --allow-run --name=johnny_decimal -f source/main.ts
```

2. Copy or source [cli.sh](./source/cli.sh) in your .bash_profile or .zshrc

3. Add environment variables to .bash_profile or .zshrc or .zprofile

```sh
export JD_HOME="$HOME/Root"
export JD_DEFAULT_APP="Sublime Text"
```

### Usage

See help command:

```sh
jd --help
```
