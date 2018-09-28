require(`colors`);

const packageInfo = require(`../package`);

module.exports = {
  isApplicable() {
    return true;
  },
  execute() {
    console.log(packageInfo.description.rainbow);
    console.error(`To list possible options use '--help'`);
    process.exit(1);
  }
};
