'use strict';

require(`colors`);

const logger = require(`./logger`);

const HELP_COMMAND = `--help`;
const VERSION_COMMAND = `--version`;

module.exports = {
  isApplicable(command) {
    return command === HELP_COMMAND;
  },
  execute() {
    logger.info(`This application does nothing. Accessible params:
${HELP_COMMAND.italic.gray}    — prints this info;
${VERSION_COMMAND.italic.gray} — prints application version;`);
  }
};
