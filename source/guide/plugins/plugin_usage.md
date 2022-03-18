# Plugin Usage

**DO NOT INSTALL PLUGINS FROM ANYWHERE YOU DO NOT TRUST**

Plugins are powerful, but kind of by definition, these are not made by me. Johnny Decimal CLI is running with fairly broad permissions, and so plugins can be quite dangerous! Please be careful when using plugins!

## Enabling Plugins

JD CLI defaults to NOT running 3rd-party plugins, so in order to use them, you will need to enable plugins:

```
jd plugins enable
```

Keep in mind that enabling plugins will **RUN ALL PLUGINS WITH THE SAME PERMISSIONS AS JD CLI**. So, again, proceed with caution.

## Installing Plugins
Plugin can be installed by simply installing the source into `~/.jd/plugins`. This directory is created by the jd setup script (this runs on the first usage of `jd`).

The easiest way to do this is to clone a directory directly into the plugins folder. 

```
git clone https://github.com/ivebencrazy/jd_plugin_sublime ~/.jd/plugins/sublime
```

When plugins are enabled, Johnny Decimal CLI will look for the `main.js` file of each plugin.  If there is no `main.js`, the plugin will not be seen.
