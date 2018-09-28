'use strict';

const args = process.argv.slice(2);

switch (args[0]) {
  case `--help`:
    console.log(`This application does nothing. Accessible params:
--help    — prints this info;
--version — prints application version;`);
    break;
  case `--version`:
    console.log(`v0.0.1`);
    break;
  default:
    console.log(`This application doesn't anything helpful. Just prints some info and version.`);
    console.error(`To list possible options use '--help'`);
}
