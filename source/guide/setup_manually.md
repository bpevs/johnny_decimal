# Manual Setup

"Manual Installation" is basically walking through the steps of the Johnny Decimal CLI's `jd install` command.

This is preferred when you want to give Johnny Decimal less permissions.

## Setup Johnny Decimal CLI

### Create `.jd` Directory

This is where we house our `cd` script, our configuration file, and any plugins. The shape of the directory is as follows.

```
.jd
  > plugins
  - config.yaml
  - main.sh
```

- The `plugins` dir is where we install plugins.
- The config.yaml file is our configuration. We can enable plugins by adding `pluginsEnabled: true`.
- `main.sh` is our [shell script](https://github.com/ivebencrazy/johnny_decimal/blob/main/source/shell/main.sh) that we use for changing directories. It's not strictly necessary, but is really helpful.

### Update Shell Config

First, we need to add our environment variables. This can be added in a variety of locations, depending on your shell, but I add these to my `.zshrc` file:

```
export JD_HOME="$HOME/Root" # Your Johnny Decimal Root
source $HOME/.jd/main.sh    # Source our cd script
# Also, if you want to install via Binary, you should add `johnny_decimal` to your PATH
```

And that's it!  Our setup is done!

## Install Johnny Decimal CLI

Now that our manual setup is done, we will never need to use `jd install`. This allows us to ignore a bit of the otherwise-required permissions. From here, we can either install the jd binary, or the package from Deno.

### Install jd via Deno

This step is still the same! Head to the [Deno homepage](https://deno.land)!

The core of this command is still:

```
deno install --name=jd https://deno.land/x/johnny_decimal@1.0.3/main.ts
```

We will want to tag on permissions as necessary:

```
deno install --name=jd --allow-env https://deno.land/x/johnny_decimal@1.0.3/main.ts
```

As an example, probably the most locked-down install of Johnny Decimal CLI would probably look something like this:

```
deno install --name=jd --allow-env=HOME,JD_HOME,JD_DIR --allow-read=$JD_HOME,$HOME/.jd https://deno.land/x/johnny_decimal@1.0.3/main.ts
```

## Install via Binary

1. Download the [latest release](https://github.com/bpevs/johnny_decimal/releases)
2. Rename the release to `johnny_decimal`, and make sure it is referenced in your `path` (for example, I have it placed in `~/.apps/bin/johnny_decimal`, and have `$HOME/.apps/bin:` added to the PATH var in my `.zprofile`).

And we're done! Setup Complete!

## Permissions

Here
s a list of all the permissions we use for different things...

### --allow-env (required)

Currently, this permission is Required to use Johnny Decimal CLI.

It is used for reading the environment variables:

- $HOME - We use this for `jd install`, which adds lines to your `.`
- $JD_HOME - Directs 
- $JD_DIR - This generally `.jd`.

`--allow-env=HOME,JD_HOME,JD_DIR`

### --allow-read (required)

This is required, and is used for reading files in your Johnny Decimal directory. You CAN however, narrow the usage of this api like so:

`--allow-read=$JD_HOME,~/.jd`

Here, we allow reading our Johnny Decimal Filesystem Root ($JD_HOME), and the directory where Johnny Decimal CLI is storing both settings and plugins (.jd) 

### --allow-net (optional)

This is used for downloading dependencies of plugins. It is not necessary if either:

1. You don't use plugins
2. Your plugins do not have any dependencies

Most strict version allowed currently is: `--allow-net=https://deno.land`.

### --allow-write (optional)

This is used by `jd install`, `jd uninstall`, and `jd plugins` commands (for writing to `.jd/config.yaml`). If you manually install Johnny Decimal CLI, then this permission is not necessary

### --allow-run (optional)

This is used by the `jd open` command. If you do not use that or any plugins that use `Deno.run`, this permission is optional.
