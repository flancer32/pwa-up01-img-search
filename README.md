# Image Search PWA

PWA to upload images to server and to search Google with images titles as a keys.

* [Environment Configuration](./doc/env.md);

## Installation

Install application in 'development' or 'demo' mode:

```shell
$ ./bin/deploy/dev.sh
$ ./bin/deploy/demo.sh
```

## Local Config

Save [./cfg/init.json](./cfg/init.json) as `./cfg/local.json` then edit local configuration options (db, port, etc.).

## Hardcoded Config

Some application properties are hardcoded as a constants (max dimensions for images, etc.):

* [./src/Back/Defaults.mjs](./src/Back/Defaults.mjs);
* [./src/Front/Defaults.mjs](./src/Front/Defaults.mjs);
* [./src/Shared/Defaults.mjs](./src/Shared/Defaults.mjs);

## CLI commands

Get help for a commands:

```shell
$ ./bin/tequila.mjs help
```

Re-create RDB structure (**CAUTION: all DB data will be lost**):

```shell
$ ./bin/tequila.mjs db-init
```

Start and stop application server:

```shell
$ ./bin/tequila.mjs web-server-start
$ ./bin/tequila.mjs web-server-stop
```

Remove image from RDB & filesystem (by backendID, by UUID, all):

```shell
$ ./bin/tequila.mjs app-image-remove -b <bid>
$ ./bin/tequila.mjs app-image-remove -u <uuid>
$ ./bin/tequila.mjs app-image-remove --all
```

Run some commands with `npm`:

```shell
$ npm run help
$ npm run db-reset
$ npm run start
$ npm run stop
```