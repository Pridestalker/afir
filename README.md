afir
====

A CLI to help with rapid wordpress development

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/afir.svg)](https://npmjs.org/package/afir)
[![Downloads/week](https://img.shields.io/npm/dw/afir.svg)](https://npmjs.org/package/afir)
[![License](https://img.shields.io/npm/l/afir.svg)](https://github.com/Pridestalker/afir/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g afir
$ afir COMMAND
running command...
$ afir (-v|--version|version)
afir/1.0.0 darwin-x64 node-v10.8.0
$ afir --help [COMMAND]
USAGE
  $ afir COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`afir dockerize`](#afir-dockerize)
* [`afir help [COMMAND]`](#afir-help-command)
* [`afir theme`](#afir-theme)

## `afir dockerize`

This command creates a docker-compose file

```
USAGE
  $ afir dockerize

OPTIONS
  -c, --[no-]setup  create directories for your project
  -d, --compose     Docker-compose upper
  -f, --force       force an overwrite of all things holy
  -h, --help        show CLI help
  --full            Launch Docker after init

EXAMPLES
  $ afir dockerize --setup
  $ afir dockerize --help
  $ afir dockerize --force
  $ afir dockerize --full
  $ afir dockerize -d
  $ afir dockerize -f -c
```

_See code: [src/commands/dockerize.ts](https://github.com/Pridestalker/afir/blob/v1.0.0/src/commands/dockerize.ts)_

## `afir help [COMMAND]`

display help for afir

```
USAGE
  $ afir help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.1/src/commands/help.ts)_

## `afir theme`

This command creates a theme directory

```
USAGE
  $ afir theme

OPTIONS
  -b, --[no-]boilerplate   Use this flag if the theme should not use a boilerplate
  -l, --location=location  [default: ./] A pre given location to setup the theme
```

_See code: [src/commands/theme.ts](https://github.com/Pridestalker/afir/blob/v1.0.0/src/commands/theme.ts)_
<!-- commandsstop -->
