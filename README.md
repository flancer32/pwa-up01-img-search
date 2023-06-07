# Image Search PWA

PWA to upload images to server and to search Google with images titles as a keys.

* [Environment Configuration](./doc/env.md);

## Installation

Requirements:

* Node.js 17+
* npm 9+

Clone repository:

```shell
$ git clone git@github.com:flancer32/pwa-up01-img-search.git
$ cd ./pwa-up01-img-search
```

Install application in 'live', 'development' or 'demo' mode:

```shell
$ ./bin/deploy/live.sh
$ ./bin/deploy/dev.sh
$ ./bin/deploy/demo.sh
```

### Dev install on Windows

ATTENTION: Configure connection to PostgreSQL DB before run `db-init`.

```shell
>git clone https://github.com/flancer32/pwa-up01-img-search.git
>cd pwa-up01-img-search
>npm install
>node .\bin\tequila.mjs help
>node .\bin\tequila.mjs db-init
>node .\bin\tequila.mjs web-server-start -1
```

Goto http://localhost:8080/ to validate app.

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