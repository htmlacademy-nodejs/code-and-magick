#!/usr/bin/env node
'use strict';

const commands = [
  require(`./src/help`),
  require(`./src/server`),
  require(`./src/version`),
  require(`./src/generate`),
  require(`./src/default`),
];

const args = process.argv.slice(2);

const param = args[0];

if (!param) {
  console.log(`No params were provided`);
  process.exit(1);
}

const commandParams = args.slice(1);

const command = param;
const promise = commands.find((it) => it.isApplicable(command)).execute(...commandParams);

if (promise) {
  promise.catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
