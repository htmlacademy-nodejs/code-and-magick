'use strict';

require(`colors`);

const logger = require(`./logger`);
const packageInfo = require(`../package`);

module.exports = {
  isApplicable() {
    return true;
  },
  execute() {
    logger.info(packageInfo.description.rainbow);
    logger.error(`To list possible options use '--help'`);
    process.exit(1);
  }
};
