'use strict';

require(`colors`);

const packageInfo = require(`../package`);

const versionParts = packageInfo.version.split(`.`);
const VERSION_COMMAND = `--version`;

module.exports = {
  isApplicable(command) {
    return command === VERSION_COMMAND;
  },
  execute() {
    console.log(`v${versionParts[0].red}.${versionParts[1].green}.${versionParts[2].blue}`);
  }
};
