'use strict';

require(`colors`);

const logger = require(`./logger`);
const packageInfo = require(`../package`);

const versionParts = packageInfo.version.split(`.`);
const VERSION_COMMAND = `--version`;

module.exports = {
  isApplicable(command) {
    return command === VERSION_COMMAND;
  },
  execute() {
    logger.info(`v${versionParts[0].red}.${versionParts[1].green}.${versionParts[2].blue}`);
  }
};
